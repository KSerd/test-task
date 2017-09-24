const https = require('https');
const http = require('http');

class Request {
  makeRequest(params) {
    return new Promise((resolve, reject) => {
      let {
        method,
        hostName,
        path,
        headers,
        data,
        protocolName,
      } = params;

      let hostnameArray = hostName.split('/');
      if (hostnameArray.length > 1) {
        hostName = hostnameArray[0];
        hostnameArray.splice(0, 1);
        path = '/' + hostnameArray.join('/') + path;
      }

      if (!headers) {
        headers = {};
      }

      if ((method === 'POST' || method === 'PUT') && headers['Content-Type'] === undefined) {
        headers['Content-Type'] = 'application/json';
      }

      let options = {
        method: method,
        host: hostName,
        path: path
      };

      if (headers !== undefined) {
        options.headers = headers;
      }

      let protocol = https;
      if (protocolName === 'http:') {
        protocol = http;
      }

      let req = protocol.request(options, (res) => {
        let result = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          result += chunk;
        });

        res.on('end', () => {
          if (res.statusCode !== 200 && res.statusCode !== 201) {
            let code = 500;
            let message = 'Problem with external service';

            return reject({
              code: code,
              message: message
            });
          }

          try {
            result = JSON.parse(result);
          } catch (e) {
            return resolve(result);
          }
          resolve(result);
        });
      });

      req.on('error', () => {
        return reject({
          code: 500,
          message: 'Problem with request'
        });
      });

      if (data !== undefined) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }
}

module.exports = Request;