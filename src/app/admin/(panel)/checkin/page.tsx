import CheckinClient from './CheckinClient';

export default function CheckinPage() {
  return (
    <>
      <header className="admin__head">
        <div><h1>Gate check-in</h1><p>Scan the visitor’s QR badge with this device’s camera, or type a badge ID or email.</p></div>
      </header>
      <CheckinClient />
    </>
  );
}
