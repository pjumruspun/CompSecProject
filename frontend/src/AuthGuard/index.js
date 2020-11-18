import { Redirect } from "react-router-dom";
import config from '../config'

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)===' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
  return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
}

const myDecipher = decipher(config.xeSv)

function readToken() {
  let token = ""
  config.token_split_key.forEach((key)=>{
    if (getCookie(key)) {
      token = token + myDecipher(getCookie(key))
    }
  })
  return token
}

function AuthGuard({children}) {
  const token = readToken()
  // console.log(token)
  if (!token) return <Redirect to="/login"/>

  return children
}
export default AuthGuard