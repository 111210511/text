const calendarGrid = document.getElementById('calendarGrid');
const calendarTitle = document.getElementById('calendarTitle');
const selectedDateLabel = document.getElementById('selectedDateLabel');
const selectedDateText = document.getElementById('selectedDate');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const memoText = document.getElementById('memoText');
const saveMemoBtn = document.getElementById('saveMemoBtn');
const memoList = document.getElementById('memoList');

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
let currentDate = new Date();
let selectedDate = formatDate(new Date());

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarTitle.textContent = `${year} 年 ${month + 1} 月`;
  selectedDateLabel.textContent = formatDisplayDate(new Date(selectedDate));
  selectedDateText.textContent = formatDisplayDate(new Date(selectedDate));

  weekdays.forEach((day) => {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-cell calendar-weekday';
    dayEl.textContent = day;
    calendarGrid.appendChild(dayEl);
  });

  for (let i = 0; i < startDay; i += 1) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell calendar-empty';
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateValue = new Date(year, month, day);
    const dateKey = formatDate(dateValue);
    const cell = document.createElement('button');
    cell.className = 'calendar-cell calendar-day';
    cell.textContent = String(day);
    cell.type = 'button';

    if (dateKey === selectedDate) {
      cell.classList.add('calendar-day--selected');
    }

    cell.addEventListener('click', () => {
      selectedDate = dateKey;
      renderCalendar();
      loadMemos();
    });

    calendarGrid.appendChild(cell);
  }
}

async function loadMemos() {
  memoList.innerHTML = '載入中...';
  try {
    const response = await fetch(`/api/memos?date=${selectedDate}`);
    const data = await response.json();
    if (data.success) {
      renderMemoList(data.memos);
    } else {
      memoList.textContent = data.error || '無法載入備忘錄。';
    }
  } catch (error) {
    memoList.textContent = `錯誤：${error.message}`;
  }
}

function renderMemoList(memos) {
  if (memos.length === 0) {
    memoList.innerHTML = '<div class="memo-empty">此日期尚無備忘錄。</div>';
    return;
  }

  memoList.innerHTML = '';
  memos.forEach((memo) => {
    const item = document.createElement('div');
    item.className = 'memo-item';

    const content = document.createElement('div');
    content.className = 'memo-item-text';
    content.textContent = memo.text;

    const meta = document.createElement('div');
    meta.className = 'memo-item-meta';
    meta.textContent = new Date(memo.createdAt).toLocaleString('zh-TW');

    const deleteButton = document.createElement('button');
    deleteButton.className = 'memo-delete-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.addEventListener('click', async () => {
      await deleteMemo(memo.id);
      loadMemos();
    });

    item.appendChild(content);
    item.appendChild(meta);
    item.appendChild(deleteButton);
    memoList.appendChild(item);
  });
}

async function saveMemo() {
  const text = memoText.value.trim();
  if (!text) {
    alert('請輸入備忘錄內容。');
    return;
  }

  saveMemoBtn.disabled = true;
  try {
    const response = await fetch('/api/memos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, text })
    });
    const data = await response.json();
    if (data.success) {
      memoText.value = '';
      loadMemos();
    } else {
      alert(data.error || '無法儲存備忘錄。');
    }
  } catch (error) {
    alert(`錯誤：${error.message}`);
  } finally {
    saveMemoBtn.disabled = false;
  }
}

async function deleteMemo(id) {
  try {
    const response = await fetch(`/api/memos/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!data.success) {
      alert(data.error || '刪除備忘錄失敗。');
    }
  } catch (error) {
    alert(`錯誤：${error.message}`);
  }
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

saveMemoBtn.addEventListener('click', saveMemo);

renderCalendar();
loadMemos();
