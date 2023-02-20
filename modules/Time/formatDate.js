import { useRouter } from 'next/router';
import Styles from './formatDate.module.css';
export default function formatDate(a, bool = true) {
    const route = useRouter()
    try {
        var dateISO = new Date(a);
        var year = dateISO.getFullYear()
        var month = dateISO.getMonth() + 1
        var date = dateISO.getDate()
        var h = dateISO.getHours()
        var m = dateISO.getMinutes()
        var s = dateISO.getSeconds()
        if (month < 10) {
            console
            String(month);
            month = '0' + month;
        }
        if (date < 10) {
            String(date);
            date = '0' + date;
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
                <span style={{fontWeight: "600"}}> {year + "-" + month + "-" + date } </span>{bool && !route.pathname.includes('/lottery') ? <br/> : ''}
                <span> { h + ":" + m + ":" + s} </span>
            </div>

        </>
        )
    } catch (error) {
        console.log(error);
        return ("undefined");
    }
}