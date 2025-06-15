# 발표 핵심 코드 및 설명 (주석/설명 추가 완전판)

---

## 1. 📱 화면 크기에 따라 섹션 크기가 자동으로 늘어났다 줄어드는 코드

**설명:**  
모든 섹션(`section`)과 홈섹션(`.hero`)에 CSS에서 `min-height: 100vh`를 주어  
브라우저의 높이에 맞게 자동으로 늘어나거나 줄어듭니다.  
특히 모바일에서는 `.hero`가 한 화면을 꽉 채워 다른 섹션이 안 보이도록 처리했습니다.

```css
section {
  /* 각 section(About, Projects 등)이 한 화면 이상 보이도록 최소 높이 설정 */
  padding: 4rem 0;
  min-height: 100vh; /* Viewport Height(화면 전체 높이)의 100% */
  background: transparent;
}

@media (max-width: 600px) {
  .hero {
    /* 모바일에서 Home(=hero) 섹션이 화면을 꽉 채움 */
    min-height: 100vh !important;
    height: 100vh !important; /* 강제로 100% 화면 */
    padding-top: 7.2rem !important;
    padding-bottom: 2.4rem !important;
    justify-content: center !important;
    align-items: center !important;
    box-sizing: border-box !important;
    overflow: hidden; /* 내부 내용이 넘칠 경우 스크롤 없이 숨김 */
  }
}
```

> **핵심 코드 설명:**
>
> - 모든 section이 적어도 **한 화면 이상** 차지하여 한 번에 하나의 섹션만 보이도록 함
> - 모바일에서는 hero(Home)가 무조건 한 화면을 차지해서 아래 About 등이 보이지 않게 함

---

## 2. 🟦 섹션 위치에 따라 nav의 색상이 바뀌는 코드

**설명:**  
스크롤할 때 각 section이 화면에 보이면  
상단 메뉴(nav)의 해당 항목에 자동으로 색상(active 클래스)이 들어옵니다.  
IntersectionObserver의 threshold를 0.2로 맞춰 자연스럽게 동작합니다.

```js
// 1. 모든 id 속성이 있는 section과 nav의 링크 선택
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('nav ul li a')

// 2. 화면에 20% 이상 보이면 감지 (threshold: 0.2)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 }

// 3. 각 section의 가시성 변화를 관찰해서 nav 색상 변경
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 모든 nav 링크에서 active 제거
      navLinks.forEach((link) => link.classList.remove('active'))
      // 현재 보이는 section의 id로 nav a 태그 선택
      const id = entry.target.getAttribute('id')
      const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`)
      if (activeLink) activeLink.classList.add('active') // 색상(active 클래스) 추가
    }
  })
}, observerOptions)

// 4. 각 section을 observer에 등록(관찰 시작)
sections.forEach((section) => observer.observe(section))
```

> **핵심 코드 설명:**
>
> - IntersectionObserver는 스크롤할 때 section이 **20% 이상** 보이면 감지
> - 해당 section에 맞는 nav 항목에 **active 클래스**를 줘서 색상 자동 변경
> - 코드 구조가 간단해서 section만 추가해도 nav가 자동 연결됨

---

## 3. 🔤 Home 버튼 글자수만큼 랜덤값으로 돌아가는 코드

**설명:**  
Home(메인) 섹션의 버튼(.btn-primary)에  
글자수만큼 랜덤 문자열이 반복해서 나타나다가,  
마우스를 올리면 원래 텍스트가 다시 보여집니다.

```js
// 모든 .btn-primary(버튼)에 대해 적용
document.querySelectorAll('.btn-primary').forEach((button) => {
  const originalText = button.textContent
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' // 랜덤 글자 후보
  let intervalId

  // 1. 랜덤 문자열로 버튼 텍스트를 빠르게 변경
  function startRandom() {
    intervalId = setInterval(() => {
      let scrambled = ''
      for (let i = 0; i < originalText.length; i++) {
        scrambled += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      button.textContent = scrambled
    }, 50)
  }

  // 2. 버튼 opacity가 1로 변경(화면에 등장)할 때 랜덤 애니메이션 시작
  const observer = new MutationObserver(() => {
    if (button.style.opacity === '1') {
      startRandom()
    } else {
      clearInterval(intervalId)
      button.textContent = originalText
    }
  })
  observer.observe(button, {
    attributes: true,
    attributeFilter: ['style'],
  })

  // 3. 마우스를 올리면 원래 텍스트로 복귀, 벗어나면 다시 랜덤
  button.addEventListener('mouseenter', () => {
    clearInterval(intervalId)
    button.textContent = originalText
  })
  button.addEventListener('mouseleave', () => {
    startRandom()
  })
})
```

> **핵심 코드 설명:**
>
> - 버튼이 나타날 때(애니메이션) 글자수만큼 랜덤 텍스트를 보여주고
> - 마우스 오버 시(hover) 원래 텍스트로 돌아오도록 함
> - 웹의 상호작용성과 재미를 더하는 시각적 효과

---

## 4. 📋 Contact 섹션(방문자 수, QnA 기능) 코드

**설명:**

- 방문자 수: `localStorage`를 사용해 브라우저 기준으로 방문자 숫자를 저장하고 표시
- QnA: 익명 질문/답변을 입력하고, 역시 localStorage에 저장해 새로고침해도 남아있음

```js
// --- 방문자 수 카운트 ---
// localStorage에 저장된 visitor-count 값을 불러와 +1(새로고침할 때마다 증가)
let visitorCount =
  parseInt(localStorage.getItem('visitor-count') || '0', 10) + 1
localStorage.setItem('visitor-count', visitorCount)
// 방문자 수를 화면에 표시
document.getElementById('visitor-count').textContent = visitorCount

// --- QnA 데이터 관리 (질문/답변) ---
// localStorage에서 qna-list 불러오기(없으면 빈 배열)
let qnaData = JSON.parse(localStorage.getItem('qna-list') || '[]')
function renderQna() {
  const list = document.getElementById('qna-list')
  if (!qnaData.length) {
    // 질문이 없으면 안내 문구 출력
    list.innerHTML =
      '<div style="color:#888; text-align:center;">아직 남겨진 질문/메시지가 없습니다.</div>'
    return
  }
  // 질문/답변 리스트를 동적으로 HTML로 만듦
  list.innerHTML = qnaData
    .map(
      (q, i) => `
      <div style="background:#181818; border-radius:15px; margin-bottom:1.5rem; padding:1.2rem 1.7rem;">
        <div style="font-size:1.15rem; color:#fff;">Q. ${q.question}</div>
        <div style="margin-top:0.7rem;">
          ${
            q.answer
              ? `<div style="color:#3ef58a; font-size:1.04rem; font-weight:500;">A. ${q.answer}</div>`
              : `
                <form data-idx="${i}" class="answer-form" style="margin-top:0.3rem;">
                  <input type="text" class="answer-input" placeholder="답변을 남겨보세요" style="padding:0.4rem 0.7rem; border-radius:8px; border:none; width:70%;"/>
                  <button type="submit" style="padding:0.45rem 1.4rem; border-radius:7px; background:#12c3ec; color:#fff; font-weight:bold; border:none; margin-left:0.6rem;">답변</button>
                </form>
              `
          }
        </div>
      </div>
      `
    )
    .join('')
  // 답변 폼이 있으면 입력 처리(폼 제출시)
  document.querySelectorAll('.answer-form').forEach((form) => {
    form.onsubmit = (e) => {
      e.preventDefault()
      const idx = parseInt(form.dataset.idx, 10)
      const input = form.querySelector('.answer-input')
      if (input.value.trim()) {
        // 답변을 저장 후 다시 렌더링
        qnaData[idx].answer = input.value.trim()
        localStorage.setItem('qna-list', JSON.stringify(qnaData))
        renderQna()
      }
    }
  })
}

// --- 질문 등록 처리 ---
// 질문 폼이 제출되면 새 질문 추가 → localStorage에 저장 후 화면 갱신
document.getElementById('qna-form').onsubmit = function (e) {
  e.preventDefault()
  const input = document.getElementById('question-input')
  const text = input.value.trim()
  if (text.length === 0) return
  qnaData.unshift({ question: text, answer: '' })
  localStorage.setItem('qna-list', JSON.stringify(qnaData))
  input.value = ''
  renderQna()
}

// 페이지 로딩 시 QnA 리스트 그리기
renderQna()
```

> **핵심 코드 설명:**
>
> - 방문자 수와 QnA 데이터는 모두 브라우저의 localStorage에 저장
> - 질문을 추가하거나 답변을 달면 바로 화면에 반영
> - 새로고침하거나 브라우저를 껐다 켜도 데이터가 유지됨
> - 실제 데이터베이스 없이도 사용자와의 상호작용 구현 가능

---

## 🔗 기타 발표 팁

- 각 코드가 **어떤 기능**을 하는지 짧게 설명 준비
- 코드를 화면에 띄우고 실제 동작을 바로 보여주면 더 효과적
- 예상 질문 대비: localStorage, IntersectionObserver 등 원리 간단히 익혀두기

---
