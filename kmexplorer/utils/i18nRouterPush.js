import Router from 'next/router'
import querystring from 'querystring';
import RuntimeConfig from '../utils/RuntimeConfig';
const BASE_URL = RuntimeConfig.BASE_URL;

export default function(path,query,res){
	let url = BASE_URL + path+'?'+querystring.stringify(query);

	if (res) {
      res.writeHead(302, {
        Location: url
      })
      res.end()
    } else {
      Router.push(url)
    }
    return {}
}