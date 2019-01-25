import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import delay from 'delay';
import shell from 'shelljs';
import util from 'util';
import { remote } from 'electron';
// import extract from 'extract-zip';



const app = remote.app;
const dialog = remote.dialog;// dialog.showErrorBox('一条信息', assetsPath);


const getPath = () => {
    let appPath;
    if (  process.env.NODE_ENV == 'development' ) {
      appPath = path.join(__dirname, '/assets/template/leah-react-app.zip')
    } else {
      appPath = path.join(app.getAppPath(), 'assets/template/leah-react-app.zip');
    }
    return appPath;
  }

//轮询监听器 判断指定路径path是否存在 决定是否clone完成 将异步操作同步化
const countListener = (gitPathFE) => {
  return new Promise((resolve, reject)=>{
    let counter = 0;
    let timer = setInterval(()=>{
      ++counter;
      // console.log('轮询监听器', counter);
      //大于100秒没结束 就直接中断
      if ( counter >= 100 ) {
        setTimeout(()=>{
          clearInterval(timer);
          resolve(false);
        }, 1000);
      }
      //判断src是否存在这个目标目录 如果存在证明clone完成
      let exists = fs.pathExistsSync(gitPathFE);
      if ( exists ) {
        setTimeout(()=>{
          clearInterval(timer);
          resolve(true);
        }, 1000);
      }
    }, 1000);
  });
}

export default async (pathPro, nameProj, terminal) => {

    const REMOTE_URL = 'http://git.code.oa.com/leah/leah-react-app.git';
    const distProjPath = path.join(pathPro, nameProj);//将脚手架文件拷贝到的路径下面 并用用户输入的项目名 新创建的文件夹路径
    const gitPathFE = path.join(pathPro, 'leah-react-app');//从git clone下来的前端脚手架leah-react-app的文件夹路径

    //判断是否存在这个目标目录 是否有重名
    const exists = await fs.pathExists(distProjPath);
    if ( exists ) {
      dialog.showErrorBox('错误信息', '当前路径存在同名目录，请更换项目名称。');
      return;
    }

    // git clone 前端项目文件 /Users/airuikun/Desktop/test
    terminal.write(`git clone ${REMOTE_URL} --depth=1\r`);
    //轮询监听器 判断src是否存在 决定是否clone完成
    let isExist = await countListener(path.join(gitPathFE, 'src'));
    if ( !isExist ) {
      dialog.showErrorBox('错误信息', '出现未知错误，请重试');
      return;
    }

    //重命名 将脚手架文件夹重命名成用户输入的名称
    await fs.move(gitPathFE, distProjPath);
    //增加点延时 防止异步操作未完成
    await delay(100);
    //删除脚手架项目里的.git文件
    await fs.remove(path.join(distProjPath, `.git`));

    //本地dev环境没法tnpm i因为nvm的原因识别不出来tnpm 线上包没这个问题
    if (process.env.NODE_ENV !== 'development') {
      terminal.write(`cd ${distProjPath}\r`);
      //增加点延时 防止异步操作未完成
      await delay(500);
      //安装依赖
      terminal.write(`tnpm i\r`);
    }







    // // -------------------------fs-extra的解决方案 失败 没法兼容windows-------------------------
    // const assetsPath = getPath();//前端项目模板的目录路径  /Users/airuikun/Desktop/test
    // const distPath = path.join(pathPro, `/${nameProj}/leah-react-app.zip`);//将脚手架zip文件拷贝到的路径文件
    // const distPathTarget = path.join(pathPro, nameProj);//将脚手架zip文件拷贝好够 解压缩到当前的目录文件夹下

    // //替换fs-extra从7.0.1降级到4.0.3 就能在mac上copy上线包app的文件到界面外 但是windows不支持
    // //拷贝项目脚手架文件
    // await fs.copy(assetsPath, distPath, err => {
    //   if (err) return dialog.showErrorBox('一条信息', JSON.stringify(err));
    //   dialog.showErrorBox('一条信息', 'success!');
    // });
   
    // //解压缩项目脚手架文件
    // extract(distPath, {dir: distPathTarget}, function (err) {
    //     // extraction is complete. make sure to handle the err
    //     console.log('err', err);
    // })

    // //cd到项目目录
    // terminal.write(`cd ${distPath}\r`);
    // //tnpm i安装依赖
    // terminal.write(`tnpm i\r`);




}