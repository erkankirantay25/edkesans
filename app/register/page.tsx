// app/register/page.tsx

'use client';

export default function RegisterPage() {
  
  const testFunction = () => {
    alert('Buton ÇALIŞIYOR!');
  };

  return (
    <div>
      <h1>Test Sayfası</h1>
      <button onClick={testFunction} style={{ padding: '20px', background: 'blue', color: 'white' }}>
        Bana Tıkla
      </button>
    </div>
  );
}