/**
 * Created by Administrator on 2017/12/28.
 */
import cheerio from 'cheerio'
import fs from 'fs';
import request from 'request'
import async from 'async'
import superagent from 'superagent'
import config from './config'
class KnowAlmost {
    constructor (options = {}) {
        this.log = typeof options.log === 'undefined' ? config.log : options.log;            /**日志模式*/
    }

    /**
     * 初始化
     * @url             [string]    爬取的页面url地址
     * @options         [object]    参数配置
     * */
    init (options = {}) {
        this._log('程序启动=>');
        return this._fetchDataByApiStart(options);
    }

    /**
     * 根据接口爬取数据
     * @options     [object]     参数配置
     * */
    async _fetchDataByApiStart (options) {
        let photo_url_arr = [];
        let loop = async (offset = 0) => {
            if (options.count_number && options.count_number < offset) return this._log('执行成功=>');
            let result = await this._fetchHtmlByApi(options.question_number, offset);
            let data = JSON.parse(result).data || [];
            let totals = JSON.parse(result).paging.totals || 0;
            if (!photo_url_arr.length && totals) this._log('该问题回答数=>' + totals + '个');
            if (!data.length || !totals || (offset + 1) * 20 >= totals) return this._log('执行成功=>没有更多答案了');
            data.forEach((item) => {
                let content = item.content;
                let $ = cheerio.load(content);
                $('img').each((index, item) => {
                    let photo_url = $(item).data('original') || '';
                    photo_url && photo_url_arr.push(photo_url);
                });
            });
            return loop(++offset);
        };
        await loop();
        let final_arr = await this._duplicateRemovalFromPhotoArr(photo_url_arr);
        this._log('即将：下载图片=>');
        this._downPhotoToLocal(final_arr).then((result) => {
            this._log('执行成功=>');
        });
    }

    /**
     * 获取接口信息
     * @question_number     [string,number]     问题号
     * @offset              [string,number]     当前页
     * */
    async _fetchHtmlByApi (question_number, offset) {
        this._log('即将：解析页面=>当前页' + offset);
        let result = '';
        await new Promise((resolve, reject) => {
            let api = 'https://www.zhihu.com/api/v4/questions/' + question_number + '/answers';
            let params = {
                'offset': offset * 20,
                'limit': 20,
                'sort_by': 'default',
                'include': 'data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question,excerpt,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp,upvoted_followees;data[*].mark_infos[*].url;data[*].author.follower_count,badge[?(type=best_answerer)].topics'
            };
            superagent
                .get(api)
                .send(params)
                .set({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'zh-CN,zh;q=0.8',
                    'Referrer': 'https://www.zhihu.com/question/' + question_number,
                    'Cookie': '_zap=a9ab675a-86b5-4321-a470-6a6fa719c592; d_c0="ABAChSwEuwuPTsVi6z1Dhz74xjjcELKItwY=|1494309012"; q_c1=84247641386f42da89d380baa324b695|1507791590000|1490256815000; r_cap_id="ZTM3ZTdhZjgwYmI3NDFjZmE1NDY3ZTJkMjgyYTVhNGM=|1512982040|832117bc35fa9640624b84b90d1d5e62403e8874"; cap_id="ZjM2OTRlMjY4NzE2NDEwYmEzN2NkNjlmNzlmZDQwMzc=|1512982040|cb2ae0375d7bcdfe314f4377a455d4b678f90275"; z_c0=Mi4xWGJIUkFnQUFBQUFBRUFLRkxBUzdDeGNBQUFCaEFsVk5JSlFiV3dBMUxmSE5mSmZiWGgyUEdTTnVrdmhuQWt1aEtB|1512982048|61da95df7ad7e07c46f4178364a720f31a0fb705; _xsrf=305d9f2d912732fb436abc754ae69baf; q_c1=84247641386f42da89d380baa324b695|1514164200000|1490256815000; __utma=51854390.575502078.1506408307.1514445619.1514533066.7; __utmz=51854390.1514533066.7.6.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100--|2=registration_date=20160401=1^3=entry_date=20160401=1; aliyungf_tc=AQAAAI7TeTyWOwwAfi343K/lCrMz7Bgx; _xsrf=305d9f2d912732fb436abc754ae69baf',
                    'Host': 'www.zhihu.com',
                    'Connection': 'keep-alive',
                    'Accept': 'application/json, text/plain, */*',
                    'authorization': config.authorization,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-UDID': 'ABAChSwEuwuPTsVi6z1Dhz74xjjcELKItwY=',
                })
                .end((err, res) => {
                    resolve();
                    res && (result = res.text);
                });
        });
        this._log('成功：解析页面=>当前页' + offset);
        return result;
    }

    /**
     * 数据去重
     * @source_arr           [array]    数据
     * */
    async _duplicateRemovalFromPhotoArr (source_arr) {
        this._log('即将：数据去重=>' + source_arr.length + '条');
        let result = [];
        source_arr.forEach((item) => {
            result.indexOf(item) === -1 && result.push(item);
        });
        this._log('成功：数据去重之后的数据=>' + result.length + '条');
        return result;
    }

    /**
     * 下载图片
     * @arr_url             [array]    图片url地址
     * */
    async _downPhotoToLocal (arr_url) {
        let result = '';
        typeof arr_url === 'string' && (arr_url = [arr_url]);
        await new Promise((resolve, reject) => {
            async.mapLimit(arr_url, 1, (url, callback) => {
                request.head(url, (err, res, body) => {
                    try {
                        let startTime = new Date().getTime();
                        !err && request(url).on('response', () => {
                            let endTime = new Date().getTime();
                            this._log('一共%s=>下载...%s.. %s, 耗时: %ss', [arr_url.length,arr_url.indexOf(url) + 1, url, (endTime - startTime) / 1000]);
                        }).pipe(fs.createWriteStream(config.storage_path + url.substring(url.lastIndexOf('/')+1)));
                        callback(null, result);}
                    catch (err) {
                        this._log('失败：下载图片=>' + url + '时');
                    }
                });
            }, (err, res) => {
                resolve();
                result = res;
            });
        });
        return result;
    }

    /**
     * 日志打印
     * @log_str         [string]    需要打印的日志
     * */
    _log (log_str, params) {
        if(!this.log) return;
        params ? console.log(log_str, ...params) : console.log(log_str + '  ' + new Date().toLocaleString());
    }

}

export default KnowAlmost