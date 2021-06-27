import { Client } from "discord.js";
import { SoundCloud } from "scdl-core";

import { prefix } from "./constant/config";
import play from "./actions/play";
import soundcloud from "./actions/soundcloud";
import skip from "./actions/skip";
import nowplaying from "./actions/nowplaying";
import pause from "./actions/pause";
import resume from "./actions/resume";
import stop from "./actions/stop";
import clear from "./actions/clear";
import queue from "./actions/queue";
import select from "./actions/select";
import loop from "./actions/loop";
import remove from "./actions/remove";

import {
  checkUserInVoiceChannel,
  checkBotInVoiceChannel,
} from "./utils/check-voice-channel";
import axios from "axios";
import moment from "moment-timezone";

export const scdl = new SoundCloud();

const bot = (): void => {
  scdl.connect().then(() => {
    const client = new Client();
    const token = process.env.TOKEN;
    const tokenThoitiet = "SZtZ7hpInlFJVcAO1hcV3xoACcpGxbyQ"

    client.on("message", (message) => {
      const args = message.content.substring(prefix.length).split(" ");
      const content = message.content
        .substring(prefix.length + args[0].length)
        .trim();
      const arr : Array<string> = []
      let mess: string

      if (message.content[0] === "!") {
        switch (args[0]) {
          case "p":
          case play.name:
            checkUserInVoiceChannel(message, () =>
              play.execute(message, content)
            );
            break;
          case "sc":
          case soundcloud.name:
            checkUserInVoiceChannel(message, () =>
              soundcloud.execute(message, content)
            );
            break;
          case "next":
          case skip.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => skip.execute(message))
            );
            break;
          case "np":
          case nowplaying.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => nowplaying.execute(message))
            );
            break;
          case pause.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => pause.execute(message))
            );
            break;
          case resume.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => resume.execute(message))
            );
            break;
          case stop.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => stop.execute(message))
            );
            break;
          case clear.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => clear.execute(message))
            );
            break;
          case queue.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => queue.execute(message))
            );
            break;
          case select.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () =>
                select.execute(message, content)
              )
            );
            break;
          case loop.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () => loop.execute(message))
            );
            break;
          case "rm":
          case remove.name:
            checkUserInVoiceChannel(message, () =>
              checkBotInVoiceChannel(message, () =>
                remove.execute(message, content)
              )
            );
            break;
          case "gaixinh":
            axios.get('https://gxcl.info/api')
              .then(({data}) => {
                console.log(data.link);
                message.channel.send(data.link);
              })
              .catch(error => {
                console.log(error);
              });
            break;
          case "gxl":
            setInterval(function () {
              axios.get('https://gxcl.info/api').then(({data}) => {
                console.log(data.link);
                if (!arr.includes(data.link)) {
                  arr.push(data.link)
                  message.channel.send(data.link);
                }
              }).catch(error => {
                console.log(error);
              });
            }, 30 * 60 * 1000);
            break;
          case "thoitiet":
            axios.get(`https://dataservice.accuweather.com/currentconditions/v1/3558164?language=vi&details=true&apikey=${tokenThoitiet}`).then(({data}) => {
              const res = data[0]
              const day = new Date(res.LocalObservationDateTime)
              const date = moment(day).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")
              const nhietDo = res.Temperature.Metric.Value
              const nhietDoMin = res.TemperatureSummary.Past24HourRange.Minimum.Metric.Value
              const nhietDoMax = res.TemperatureSummary.Past24HourRange.Maximum.Metric.Value
              const doAm = res.RelativeHumidity
              const chiSoUV = res.UVIndex
              const chiSoUVText = res.UVIndexText
              const thoiTiet = res.WeatherText
              const mua = res.HasPrecipitation === true ? "Có mưa" : "Không mưa"

              mess = `>>> Tình hình thời tiết Long Biên ngày ${date}:
+ ${thoiTiet}
+ Nhiệt độ hiện tại: ${nhietDo}°C
+ Nhiệt độ trong 24h: ${nhietDoMin} - ${nhietDoMax}°C
+ Độ ẩm: ${doAm}%
+ Chỉ số UV: ${chiSoUV} ${chiSoUVText}
+ Dự báo mưa: ${mua}`
              message.channel.send(mess);
            })
              .catch(error => {
                console.log(error);
              });
            break;
          case "quote":
            axios.get('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json').then(({data}) => {
              const quoteText = data.quoteText
              const quoteAuthor = data.quoteAuthor
              const mess = `>>> ${quoteText} - ${quoteAuthor}`
              message.channel.send(mess);
            }).catch(error => {
              console.log(error);
            });
            break;
          case "kqxs":
            axios.get('https://168xoso.com/result.json').then(({data}) => {
              const res = data.north
              const date = moment(res.date).format("DD/MM/YYYY")
              const giai: any = Object.values(res)[0]
              const db = giai[0]
              const g1 = giai[1]
              const g2 = giai[2]
              const g3 = giai[3]
              const g4 = giai[4]
              const g5 = giai[5]
              const g6 = giai[6]
              const g7 = giai[7]
              mess = `>>> Kết quả xổ số miền Bắc ngày ${date}:
+ G.DB: ${db}
+ G.1   :  ${g1}
+ G.2  :  ${g2.join(' - ')}
+ G.3  :  ${g3.join(' - ')}
+ G.4  :  ${g4.join(' - ')}
+ G.5  :  ${g5.join(' - ')}
+ G.6  :  ${g6.join(' - ')}
+ G.7  :  ${g7.join(' - ')}`
              message.channel.send(mess);
            }).catch(error => {
              console.log(error);
            });
            break;
          case "btc":
            axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
              .then(({data}) => {
                const time = data.time.updatedISO
                const date = moment(time).tz("Asia/Ho_Chi_Minh").format("h:mm:ssA DD/MM/YYYY")
                const rate  = data.bpi.USD.rate_float
                mess = `>>> Giá Bitcoin: ***${rate}***  USD/BTC
Cập nhật lúc ${date}`
                message.channel.send(mess);
              })
              .catch(error => {
                console.log(error);
              });
            break;
          case "help":
            mess = `>>> **Commands: **
+ gaixinh: Ngẫu nhiên 1 ảnh gái xinh
+ thoitiet: Dự báo thời tiết Hà Nội
+ kqxs: Kết quả xổ số miền Bắc
+ btc: Tỷ giá Bitcoin
+ quote: Ngẫu nhiên 1 quote tiếng anh
+ play (link OR name): Play nhạc youtube
+ sc (link OR name): Nhạc soundcloud
+ next OR skip: Bỏ qua bài hát hiện tại
+ np: Bài hát hiện tại
+ pause: Tạm dừng
+ resume: Tiếp tục
+ select (number): Chọn nhạc trong list
+ remove (number): Xóa bài hát khỏi list
+ stop: Tắt nhạc và rời khỏi kênh
+ clear: Xóa list nhạc
+ queue: Show list nhạc
+ loop: Lặp lại bài hát hiện tại`
            message.channel.send(mess);
            break;
        }
      }
    });

    client.on("ready", () => {
      console.log("Gaixinh is online!");
    });

    client.on("reconnecting", () => {
      console.log("Reconnecting!");
    });

    client.on("disconnect", () => {
      console.log("Disconnect!");
    });

    client.login(token);
  });
};

export default bot;
