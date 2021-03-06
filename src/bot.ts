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

      if (message.content[0] === "-") {
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
              const mua = res.HasPrecipitation === true ? "C?? m??a" : "Kh??ng m??a"

              mess = `>>> T??nh h??nh th???i ti???t Long Bi??n ng??y ${date}:
+ ${thoiTiet}
+ Nhi???t ????? hi???n t???i: ${nhietDo}??C
+ Nhi???t ????? trong 24h: ${nhietDoMin} - ${nhietDoMax}??C
+ ????? ???m: ${doAm}%
+ Ch??? s??? UV: ${chiSoUV} ${chiSoUVText}
+ D??? b??o m??a: ${mua}`
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
              mess = `>>> K???t qu??? x??? s??? mi???n B???c ng??y ${date}:
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
                mess = `>>> Gi?? Bitcoin: ***${rate}***  USD/BTC
C???p nh???t l??c ${date}`
                message.channel.send(mess);
              })
              .catch(error => {
                console.log(error);
              });
            break;
          case "help":
            mess = `>>> **Commands: **
+ gaixinh: Ng???u nhi??n 1 ???nh g??i xinh
+ thoitiet: D??? b??o th???i ti???t H?? N???i
+ kqxs: K???t qu??? x??? s??? mi???n B???c
+ btc: T??? gi?? Bitcoin
+ quote: Ng???u nhi??n 1 quote ti???ng anh
+ play (link OR name): Play nh???c youtube
+ sc (link OR name): Nh???c soundcloud
+ next OR skip: B??? qua b??i h??t hi???n t???i
+ np: B??i h??t hi???n t???i
+ pause: T???m d???ng
+ resume: Ti???p t???c
+ select (number): Ch???n nh???c trong list
+ remove (number): X??a b??i h??t kh???i list
+ stop: T???t nh???c v?? r???i kh???i k??nh
+ clear: X??a list nh???c
+ queue: Show list nh???c
+ loop: L???p l???i b??i h??t hi???n t???i`
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
