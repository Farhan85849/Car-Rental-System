import React, { useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import 'flatpickr/dist/themes/dark.css';
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css';

export default function Test() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const endRef = useRef<any>(null);

  return (
    <div style={{ padding: 100, background: '#000', height: '100vh', color: 'white' }}>
      <h1>Flatpickr Test</h1>
      <Flatpickr
        data-enable-time
        value={start}
        onChange={([d]) => setStart(d.toISOString())}
        options={{
          enableTime: true,
          plugins: [
            confirmDatePlugin({ confirmText: "OK", showAlways: true, theme: "dark" })
          ]
        }}
        onClose={() => {
           setTimeout(() => {
             if(endRef.current?.flatpickr) endRef.current.flatpickr.open();
           }, 100);
        }}
      />
      <br/><br/>
      <Flatpickr
        ref={endRef}
        data-enable-time
        value={end}
        onChange={([d]) => setEnd(d.toISOString())}
        options={{
          enableTime: true,
          plugins: [
            confirmDatePlugin({ confirmText: "OK", showAlways: true, theme: "dark" })
          ]
        }}
      />
    </div>
  )
}
