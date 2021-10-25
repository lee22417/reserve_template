import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatService {
  // php addslashes
  addslashes(str: string): string {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }

  // ------ date ----
  // Y-m-d format
  ymdFormat(date: Date) {
    const year: number = date.getFullYear();
    let month: string = '' + (date.getMonth() + 1);
    let day: string = '' + date.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // H:i:s format
  hisTimeFormat(date: Date) {
    let hour: string = '' + date.getHours();
    let min: string = '' + date.getMinutes();
    let sec: string = '' + date.getSeconds();

    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    if (sec.length < 2) sec = '0' + sec;

    return [hour, min, sec].join(':');
  }

  // H:i:s format
  hismsTimeFormat(date: Date) {
    let hour: string = '' + date.getHours();
    let min: string = '' + date.getMinutes();
    let sec: string = '' + date.getSeconds();
    const ms: string = '' + date.getMilliseconds();

    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    if (sec.length < 2) sec = '0' + sec;

    return [hour, min, sec, ms].join(':');
  }

  //Y-m-d H:i:s format
  ymdhisFormat(date: Date) {
    return [this.ymdFormat(date), this.hisTimeFormat(date)].join(' ');
  }

  // strtotime in php
  strtotime(date: Date, gap): Date {
    let result = date.getTime();
    if (gap.hour) result += 1000 * 60 * 60 * gap.hour;
    if (gap.min) result += 1000 * 60 * gap.min;
    if (gap.sec) result += 1000 * gap.sec;
    return new Date(result);
  }

  // sub minitues
  subMinutes(date: Date, min: number): Date {
    return this.strtotime(date, { min: min * -1 });
  }

  // to UTC timezone
  toUTC(date: Date): Date {
    return this.strtotime(date, { hour: -9 });
  }

  // to Asia/Seoul timezone
  toAsiaSeoul(date: Date): Date {
    return this.strtotime(date, { hour: 9 });
  }

  // json parse
  parseJsonData(data) {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);

    return {};
  }
}
