import Styles from './formatDate.module.css';
import React, {useState, useEffect} from "react";
export default function formatDate({postCreateDateFormat, currentLanguage}) {
    const [language, setLanguage] = useState();

    useEffect(() => {
        if(currentLanguage!== undefined && currentLanguage === "en" || currentLanguage === "vn") {
            setLanguage(require(`./dateFormated/${currentLanguage}.json`));
        }else{
            setLanguage(require(`./dateFormated/en.json`));
        }
    }, [currentLanguage])

    try {
        var dateISO = new Date(postCreateDateFormat);
        var year = dateISO.getFullYear()
        var month = dateISO.getMonth() + 1
        var date = dateISO.getDate()
        var day = dateISO.getDay() + 1
        var h = dateISO.getHours()
        var m = dateISO.getMinutes()
        var s = dateISO.getSeconds()
        if (month < 10) {
            if(language) {
                month = language["date-month"][month];
            }
            String(month);
            month = '' + month;
        }
        if (date < 10) {
            String(date);
            date = '0' + date;
        }
        if (day < 10) {
            if(language) {
                day = language["date-day"][day];
            }
            String(day);
            day = '' + day;
        }
        if (h < 10) {
            String(h);
            h = '0' + h;
        }
        if (m < 10) {
            String(m);
            m = '0' + m;
        }
        if (s < 10) {
            String(s);
            s = '0' + s;
        }
        return (
        <>  
            <div className={Styles['date']}>
                <span> {day + " ," + month + ' ' + date + " ," + year + ' ' + "at" + ' ' + h + ":" + m} </span>
            </div>
        </>
        )
    } catch (error) {
        console.log(error);
        return ("undefined");
    }
}