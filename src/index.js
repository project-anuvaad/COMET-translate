import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'proxy-polyfill';
import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

const direflowProperties = {
  apiKey: "a98c91c0-c2b1-4db0-a178-e4593c7345a0-1582816927127-2d715b6e-b780-4d00-8182-b1a78ac05f5d",
  apiRoot: 'http://localhost:4000/api',
  articleId: '5e36fd108e28ec004b9b33b3',
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
  name: 'vw-translate',
  // useShadow: true,
  properties: direflowProperties,
  plugins: direflowPlugins,
});

direflowComponent.create(App);
