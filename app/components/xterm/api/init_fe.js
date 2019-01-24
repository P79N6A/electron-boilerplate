import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import delay from 'delay';
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

export default async (pathPro, terminal) => {
    const assetsPath = getPath();//前端项目模板的目录路径
    const distPath = path.join(pathPro, '/FEProject/leah-react-app.zip');//将脚手架zip文件拷贝到的路径文件
    const distPathTarget = path.join(pathPro, '/FEProject/');//将脚手架zip文件拷贝好够 解压缩到当前的目录文件夹下
    

    //判断是否存在这个目标目录 是否有重名
    const exists = await fs.pathExists(distPath);
    if ( exists ) {
        dialog.showErrorBox('错误信息', '当前路径存在同名目录，请更换项目名称。');
        return;
    }
    


    // //拷贝项目脚手架文件
    // await fs.copy(assetsPath, distPath);

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