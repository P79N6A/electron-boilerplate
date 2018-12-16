## Usage

	0.终端选择：
		本地调试用这个：let shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
		线上用这个：const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

	1.mac上安装:
		git clone 项目地址
		leah proxy #代理网络到外网环境 使用npm 因为tnpm用不了 会报错
		顶层：npm i 
		内层：不用执行

		不要用yarn安装 用npm

		npm安装的时候可能会报错 要设置一下仓库
				npm config set registry "https://registry.npmjs.org"

	2.本地运行用npm run dev  而不要用npm run start

	2.windows上安装：
		git clone 项目地址
		leah proxy
		第一次安装可能会缺少python模块：
			npm install --global --production windows-build-tools 				
		项目顶层目录 ：npm i


	3.编译:
		mac:
			翻墙：编译的时候一定要翻墙  因为electron-builder要翻墙下载一些包才可以
			执行npm run package
		windows:
			翻墙
			打包编译的时候 不能用中文路径名 否则windows打包编译的时候会报错
			执行npm run package

	4.tnpm用不了 会报错






## 注意事项
1.用node-pty-prebuilt去替代node-pty 可以省很多的事

2.打包编译的时候 不能用中文路径名 否则windows打包编译的时候会报错

3.git commit -m "conflict" --no-verify

4.打包编译的时候要翻墙




## old


0.用node-pty-prebuilt去替代node-pty 可以省很多的事

1.打包编译的时候 不能用中文路径名 否则windows打包编译的时候会报错



1.electron 终端：node-pty 结合 xterm 的时候 打开终端的例子
例子地址：
https://github.com/Microsoft/node-pty/tree/master/examples/electron
官网例子：https://www.npmjs.com/package/node-pty

	bug-1（最重要的bug）：用node-pty-prebuilt去代替node-pty这个包

    bug0(最重要的bug): ********node-pty一直在报错 安装不上去：
			0：（可以先试一下这个方法 再去试下面的方法）用node-pty-prebuilt去代替项目中的node-pty这个包


          	1.一定要结合npm_install.sh
          	2.去掉所有代理
    	   	npm config set proxy null
    	   	npm config set https-proxy null
          	3.再加上个人热点才能正确安装 否则node-pty会报错
    		4.node-pty 和 xterm要安装在例子的子目录的app里的package.json里 要不然会报错

    bug1：前期安装东西的时候 可能要把所有的tm内外网代理全部去掉 用个人热点去安装依赖：
    	npm config set proxy null
    	npm config set https-proxy null

    	用个人热点去安装依赖

    bug2：打开终端 所有的node找不到命令 是因为shell它指定错了
    	把const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];这行改成下面即可
    	var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

	bug3:windows上更新electron-updater后就可以编译打包electron-react-boilerplate了 执行的是npm run package本地打包

	bug4:下面文章说 electron是被墙了 所以需要翻墙 才能安装   打包编译的时候 所需要下载的文件也需要翻墙
			https://ystyle.top/2017/02/27/electron-react-boilerplate-kai-huan-jing-da-jian/

			翻墙后下载的文件的路劲：
					Linux: $XDG_CACHE_HOME or ~/.cache/electron/
					MacOS: ~/Library/Caches/electron/
					Windows: $LOCALAPPDATA/electron/Cache or ~/AppData/Local/electron/Cache/

	bug5：打包编译：
		mac打包mac  windows下去打包windows
		翻墙
		不能有中文路径


2.想要加全局样式或者直接引入 css 的方法： 1.将 css 放入 app.global.css 文件里
2.app.global.css 文件里加入 @import "~xterm/dist/xterm.css";

3.electron-react-boilerplate 脚手架参考的https://github.com/electron-react-boilerplate/electron-react-boilerplate

4.xterm 和 node-pty 要安装在 app 文件夹下的 package.json 而不是外层的项目 package.json

5.打包编译的时候 npm run package 和 npm run package-all 的时候 要代理到外网 leah proxy 才能打包 否则会报错
问题参考https://github.com/electron-userland/electron-builder/issues/3217
去~/Library/Caches/electron/下 把 electron 的 zip 包删掉 然后重新 npm run package 和 npm run package-all 一下 electron-builder 会自动再下载对应的 electron 的 zip 包

    注意 清除所有代理 + 开启个人热点 没有用 只能用leah proxy


6.git commit -m "conflict" --no-verify
