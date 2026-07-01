export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>HKlog</h1>
      <p>나의 기록 시스템</p>

      <div style={{ marginTop: 20 }}>
        <a href="/write">✍ 글 작성</a>
        <br />
        <a href="/logs">📚 기록 보기</a>
      </div>
    </main>
  );
}