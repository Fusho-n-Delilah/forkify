import { TIMEOOUT } from "./config";


const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined){
    try {
        const fetchPro = uploadData ? sfetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData),
          }) : fetch(url);

          const res = await Promise.race([fetch(url), timeout(TIMEOOUT)]);
          const data = await res.json();

          if (!res.ok) throw new Error(`${data.message} (${res.status})`);

          return data;
          
    } catch (err) {
        throw err;
    }

}

/*
export const getJSON = async function(url){
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOOUT)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
        
    } catch (err) {
        throw err;
    }
}

export const sendJSON = async function(url, uploadData){
    try {
        const fetchPost = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        })

        const res = await Promise.race([fetchPost, timeout(TIMEOOUT)]);
        const responseData = await res.json();

        if (!res.ok) throw new Error(`${responseData.message} (${res.status})`);

        return responseData;
        
    } catch (err) {
        throw err;
    }
}

*/
