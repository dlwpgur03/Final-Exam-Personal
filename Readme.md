# 발표 핵심 코드 및 설명

---

## 1. 📱 화면 크기에 따라 섹션 크기가 자동으로 늘어났다 줄어드는 코드

**설명:**  
모든 섹션(`section`)과 홈섹션(`.hero`)에 CSS에서 `min-height: 100vh`를 주어  
브라우저의 높이에 맞게 자동으로 늘어나거나 줄어듭니다.  
특히 모바일에서는 `.hero`가 한 화면을 꽉 채워 다른 섹션이 안 보이도록 처리했습니다.

```css
section {
  padding: 4rem 0;
  min-height: 100vh;
  background: transparent;
}

@media (max-width: 600px) {
  .hero {
    min-height: 100vh !important;
    height: 100vh !important;
    padding-top: 7.2rem !important;
    padding-bottom: 2.4rem !important;
    justify-content: center !important;
    align-items: center !important;
    box-sizing: border-box !important;
    overflow: hidden;
  }
}
```

---

## 2. 🟦 섹션 위치에 따라 nav의 색상이 바뀌는 코드

**설명:**  
스크롤할 때 각 section이 화면에 보이면  
상단 메뉴(nav)의 해당 항목에 자동으로 색상(active 클래스)이 들어옵니다.  
IntersectionObserver의 threshold를 0.2로 맞춰 자연스럽게 동작합니다.

```js
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('nav ul li a')
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 }

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove('active'))
      const id = entry.target.getAttribute('id')
      const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`)
      if (activeLink) activeLink.classList.add('active')
    }
  })
}, observerOptions)

sections.forEach((section) => observer.observe(section))
```

---

## 3. 🔤 Home 버튼 글자수만큼 랜덤값으로 돌아가는 코드

**설명:**  
Home(메인) 섹션의 버튼(.btn-primary)에  
글자수만큼 랜덤 문자열이 반복해서 나타나다가,  
마우스를 올리면 원래 텍스트가 다시 보여집니다.

```js
document.querySelectorAll('.btn-primary').forEach((button) => {
  const originalText = button.textContent
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let intervalId

  function startRandom() {
    intervalId = setInterval(() => {
      let scrambled = ''
      for (let i = 0; i < originalText.length; i++) {
        scrambled += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      button.textContent = scrambled
    }, 50)
  }

  // 버튼이 나타날 때 랜덤 시작
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

  button.addEventListener('mouseenter', () => {
    clearInterval(intervalId)
    button.textContent = originalText
  })

  button.addEventListener('mouseleave', () => {
    startRandom()
  })
})
```

---

## 4. 📋 Contact 섹션(방문자 수, QnA 기능) 코드

**설명:**

- 방문자 수: `localStorage`를 사용해 브라우저 기준으로 방문자 숫자를 저장하고 표시
- QnA: 익명 질문/답변을 입력하고, 역시 localStorage에 저장해 새로고침해도 남아있음

```js
// 방문자 카운트 (localStorage 사용)
let visitorCount =
  parseInt(localStorage.getItem('visitor-count') || '0', 10) + 1
localStorage.setItem('visitor-count', visitorCount)
document.getElementById('visitor-count').textContent = visitorCount

// QnA 데이터 저장
let qnaData = JSON.parse(localStorage.getItem('qna-list') || '[]')
function renderQna() {
  const list = document.getElementById('qna-list')
  if (!qnaData.length) {
    list.innerHTML =
      '<div style="color:#888; text-align:center;">아직 남겨진 질문/메시지가 없습니다.</div>'
    return
  }
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
  // 답변 폼 이벤트 등록
  document.querySelectorAll('.answer-form').forEach((form) => {
    form.onsubmit = (e) => {
      e.preventDefault()
      const idx = parseInt(form.dataset.idx, 10)
      const input = form.querySelector('.answer-input')
      if (input.value.trim()) {
        qnaData[idx].answer = input.value.trim()
        localStorage.setItem('qna-list', JSON.stringify(qnaData))
        renderQna()
      }
    }
  })
}

// 질문 등록
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

renderQna()
```

---

## 🔗 기타 발표 팁

- 각 코드가 **어떤 기능**을 하는지 짧게 설명 준비
- 코드를 화면에 띄우고 실제 동작을 바로 보여주면 더 효과적
- 예상 질문 대비: localStorage, IntersectionObserver 등 원리 간단히 익혀두기

---
