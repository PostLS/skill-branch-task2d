import express from 'express';
import cors from 'cors';

var app = express();
app.use(cors());

app.get('/', (req, res) => {
	if(req.query.color === undefined) {
		res.send("Invalid color");
	}
	var str = req.query.color;
	if(str.indexOf('#rgb') >= 0) {
		res.send("Invalid color");
	}
	if(str.indexOf('rgb') >= 0) {
		str = str.slice(str.indexOf('rgb') + 4, str.length-1);
		str = str.split(',');
		if(str.length < 3 || str.length > 3) {
			res.send("Invalid color");
		}
		for(var i = 0; i < str.length; i++) {
			if(str[i] > 255) {
				res.send("Invalid color");
			}
			str[i] = (+str[i]).toString(16);
			if(str[i].length < 2) {
				str[i] = '0' + str[i];
			}
		}
		res.send('#' + str.join(''));
	}
	if(str.indexOf('hsl') >= 0) {
		str = str.slice(str.indexOf('hsl') + 4, str.length-1);
		str = str.split(",");
		str[1] = str[1].slice(3);
		str[2] = str[2].slice(3);
		if(str[1].indexOf('%') < 1 || str[2].indexOf('%') < 1) {
			res.send("Invalid color");
		}
		function HSLtoHEX(H, S, L) {
			var Q, P, Hk, T = [], C = [];
			S = parseInt(S) / 100;
			L = parseInt(L) / 100;
			if(H > 359 || S > 1 || L > 1 || H < 0 || S < 0 || L < 0) {
				return "Invalid color";
			}
			if(L < 0.5) {
				Q = L * (1 + S);
			} else {
				Q = L + S - (L * S);
			}
			P = 2 * L - Q;
			Hk = H / 360;
			T[0] = Hk + 1/3;
			T[1] = Hk;
			T[2] = Hk - 1/3;
			for(var i = 0; i < 3; i++) {
				if(T[i] < 0) {
					T[i] += 1;
				} else if(T[i] > 1) {
					T[i] -= 1;
				}
			}
			for (var j = 0; j < 3; j++) {
				if(T[j] < 1/6) {
					C[j] = P + ((Q - P) * 6 * T[j]);
				} else if(T[j] < 1/2 && T[j] >= 1/6) {
					C[j] = Q;
				} else if(T[j] >= 1/2 && T[j] < 2/3) {
					C[j] = P + ((Q - P) * (2/3 - T[j]) * 6);
				} else {
					C[j] = P;
				}
			}
			for(var n = 0; n < 3; n++) {
				C[n] = Math.round(C[n] * 255);
			}
			for(var m = 0; m < C.length; m++) {
			if(C[m] > 255) {
				res.send("Invalid color");
			}
			C[m] = (+C[m]).toString(16);
			if(C[m].length < 2) {
				C[m] = '0' + C[m];
			}
		}
			return '#' + C.join('');
		}
		res.send(HSLtoHEX(str[0], str[1], str[2]));
	}
	if(str[0] === '#') {
		str = str.slice(1);
	}
	while(str[0] === ' ') {
		str = str.slice(1);
	}
	if(str.length !== 3) {
		if(str.length !== 6) {
			res.send("Invalid color");
		}
	}
	for(var i = 0; i < str.length; i++) {
		if(str[i].charCodeAt() < 48 || str[i].charCodeAt() > 102) {
			res.send("Invalid color");
		} else if(str[i].charCodeAt() > 57 && str[i].charCodeAt() < 65) {
			res.send("Invalid color");
		} else if(str[i].charCodeAt() > 90 && str[i].charCodeAt() < 97) {
			res.send("Invalid color");
		}
	}
	var arr = str.toLowerCase().split(''), result = new Array();
	if(arr.length === 3) {
		result[0] = result[1] = arr[0];
		result[2] = result[3] = arr[1];
		result[4] = result[5] = arr[2];
	} else {
		result = arr;
	}
	result.unshift('#');
	res.send(result.join(''));
});

app.listen(3000, function() {
	console.log("Connected");
})
