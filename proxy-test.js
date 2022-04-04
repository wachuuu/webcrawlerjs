const axios = require('axios'); 
 
const proxy = { 
	protocol: 'http', 
	host: '194.5.193.183', // Free proxy
	port: 80, 
}; 

const headers = { 
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 
		'Accept-Encoding': 'gzip, deflate, br', 
		'Accept-Language': 'en-US,en;q=0.9', 
		'Sec-Ch-Ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"', 
		'Sec-Ch-Ua-Mobile': '?0', 
		'Sec-Fetch-Dest': 'document', 
		'Sec-Fetch-Mode': 'navigate', 
		'Sec-Fetch-Site': 'none', 
		'Sec-Fetch-User': '?1', 
		'Upgrade-Insecure-Requests': '1', 
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36', 
	};

(async () => { 
	const { data } = await axios.get('https://www.morele.net/', { proxy }, { headers: headers }); 
 
	console.log(data); 
})(); 
	