import NotificationTable from '@/components/Notification/NotificationTable';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';

export default function Notification() {
  return (
    <>
      <div className="card">
      <div className={styles.pageTitle} style={{marginBottom: "38px"}}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Notification</li>
        </ul>
      </div>

      <NotificationTable />
      </div>
    </>
  );
}
