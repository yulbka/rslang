import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { router } from './routes/index';

if (localStorage.getItem('token')) {
  router.navigate('/');
} else {
  router.navigate('login');
}
