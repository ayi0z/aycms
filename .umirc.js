// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  // routes: [
  //   {
  //     path: '/',
  //     component: '../layouts/index',
  //     routes: [
  //       {
  //         path: '/account/login',
  //         component: './account/login',
  //       },
  //       {
  //         path: '/collect/sourceapi',
  //         component: './collect/sourceapi',
  //       },
  //       {
  //         path: '/collect/index',
  //         component: './collect/index',
  //       },
  //       {
  //         path: '/datarepo/index',
  //         component: './datarepo/index',
  //       },
  //       {
  //         path: '/videosetting/index',
  //         component: './videosetting/index',
  //       },
  //       {
  //         path: '/data/index',
  //         component: './data/index',
  //       },
  //       {
  //         path: '/',
  //         component: '../pages/index',
  //       },
  //     ],
  //   },
  // ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        dynamicImport: {
          webpackChunkName: true,
        },
        title: 'AYCMS',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};
