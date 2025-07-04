import {ScrollTest} from '~/components/ScrollTest';
import scrollTestStyles from '~/styles/scroll-test.css';

export function links() {
  return [{ rel: 'stylesheet', href: scrollTestStyles }];
}

export default function ScrollTestPage() {
  return (
    <div>
      <h1>Scroll Observer Test</h1>
      <ScrollTest />
    </div>
  );
}