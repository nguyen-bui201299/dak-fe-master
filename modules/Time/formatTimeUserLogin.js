export default function TimeUserLogin(time = 0){

    var timeNow = Date.now();
    var timeCreat = parseInt(timeNow - time);
    var timeSecons = Math.floor(timeCreat/1000);
    if((timeSecons >= 0) && (timeSecons <= 60)){
        return `${timeSecons}s`;
    }
    else{
        if((timeSecons >= 60) && (timeSecons < 3600)){
            var minute = Math.floor(timeSecons % 3600/60);
            return `${minute}m`;
        }
        else{
            if((timeSecons >=3600) && (timeSecons < 86400)){
                var hour = Math.floor(timeSecons % (3600*24)/3600);
                return `${hour}h`;
            }
            else{
                if((timeSecons >= 86400) && (timeSecons < 2592000)){
                    var date = Math.floor(timeSecons / (3600*24));
                    return `${date}d`;
                }
                else{
                    if((timeSecons >= 2592000) && (timeSecons < 31104000)){
                        var month = Math.floor(timeSecons/(60*60*24*30));
                        return month >= 2 ? `${month} months` : `${month} month`;
                    }
                    else{
                        if(timeSecons >= 31104000){
                            var year = Math.floor(timeSecons/(60*60*24*365));
                            return year >= 2 ? `${year} years` : `${year} year`;
                        }
                    }
                }
            }
        }
    }
}

