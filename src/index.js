import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'proxy-polyfill';
import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

const direflowProperties = {
  apiKey: '',
  apiRoot: process.env.NODE_ENV === 'production' ? 'https://comet.anuvaad.org/api' :  'http://localhost:4000/api',
  articleId: '',
  backRoute: '',
  // apiKey: '',
  // apiRoot: '',
  // articleId: '',
};

const direflowPlugins = [
  // {
  //   name: 'font-loader',
  //   options: {
  //     google: {
  //       families: ['Advent Pro', 'Noto Sans JP'],
  //     },
  //   },
  // },
];

direflowComponent.configure({
  name: 'vd-translate',
  // useShadow: true,
  properties: direflowProperties,
  plugins: direflowPlugins,
});

direflowComponent.create(App);
