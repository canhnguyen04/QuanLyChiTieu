// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyBHF-R8x3kbj2wWBT3c-9qcfQ9JMoQCDps",
  authDomain: "quanlychitieu-f9b7c.firebaseapp.com",
  databaseURL: "https://quanlychitieu-f9b7c-default-rtdb.firebaseio.com",
  projectId: "quanlychitieu-f9b7c",
  storageBucket: "quanlychitieu-f9b7c.firebasestorage.app",
  messagingSenderId: "1091480797172",
  appId: "1:1091480797172:web:a5eefff7adad101dd343a1"
};

// Khởi tạo Firebase
let app, auth, database;
let currentUser = null;

// Kiểm tra nếu Firebase đã được load
if (typeof firebase !== 'undefined') {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  database = firebase.database();
  
  // Lắng nghe trạng thái đăng nhập
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      showApp();
      loadFromFirebase();
    } else {
      currentUser = null;
      showAuth();
    }
  });
} else {
  console.warn('Firebase chưa được cấu hình. Vui lòng xem file HUONG-DAN-FIREBASE.md');
  // Fallback: Dùng LocalStorage như trước
  showApp();
}

// ===== AUTHENTICATION FUNCTIONS =====
function showLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.auth-tab')[0].classList.add('active');
}

function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

function showAuth() {
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('app-container').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';
  if (currentUser) {
    document.getElementById('user-email').textContent = currentUser.email;
  }
}

// Đăng nhập
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert('Đăng nhập thành công!');
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
});

// Đăng ký
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  
  if (password !== confirm) {
    alert('Mật khẩu không khớp!');
    return;
  }
  
  if (password.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }
  
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert('Đăng ký thành công!');
    showLogin();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
});

// Đăng xuất
function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    auth.signOut();
  }
}

// ===== FIREBASE SYNC FUNCTIONS =====
function saveToFirebase() {
  if (currentUser && database) {
    database.ref('users/' + currentUser.uid + '/transactions').set(transactions);
    database.ref('users/' + currentUser.uid + '/quickNotes').set(quickNotes);
  }
}

function loadFromFirebase() {
  if (currentUser && database) {
    database.ref('users/' + currentUser.uid + '/transactions').once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        transactions = data;
        init();
      }
    });
    
    database.ref('users/' + currentUser.uid + '/quickNotes').once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        quickNotes = data;
        displayQuickNotes();
      }
    });
    
    // Realtime sync
    database.ref('users/' + currentUser.uid + '/transactions').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        transactions = data;
        init();
      }
    });
    
    database.ref('users/' + currentUser.uid + '/quickNotes').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        quickNotes = data;
        displayQuickNotes();
      }
    });
  }
}

// ===== ORIGINAL CODE =====
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. Lấy dữ liệu từ LocalStorage (nếu có)
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// Nếu chưa có dữ liệu thì dùng mảng rỗng
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Quản lý ghi chú nhanh
const localStorageQuickNotes = JSON.parse(
  localStorage.getItem('quickNotes')
);

let quickNotes = 
  localStorage.getItem('quickNotes') !== null ? localStorageQuickNotes : [];

// Biến để lưu ID ghi chú đang chỉnh sửa
let editingNoteId = null;

// Migration: Thêm date cho giao dịch cũ không có date
transactions = transactions.map(t => {
  if (!t.date) {
    // Gán date mặc định là đầu tháng hiện tại cho dữ liệu cũ
    t.date = new Date().toISOString();
  }
  return t;
});

// Lưu lại sau khi migration
if (transactions.length > 0) {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Biến để lưu ID đang chỉnh sửa
let editingId = null;

// Biến để track xem có hiển thị tất cả không
let showAll = false;

// Biến để lưu tháng hiện tại đang xem
let currentViewMonth = new Date().getMonth();
let currentViewYear = new Date().getFullYear();

// 1.1. Thêm format số tiền khi blur (bấm ra ngoài input)
amount.addEventListener('blur', (e) => {
  // Lấy giá trị và xóa tất cả dấu phẩy cũ
  let value = e.target.value.replace(/,/g, '').trim();
  
  // Nếu có giá trị và là số thì format
  if (value && !isNaN(value) && value !== '') {
    // Format thủ công bằng regex để không mất số
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = formatted;
  }
  // Nếu không phải số hoặc rỗng, giữ nguyên (không làm gì)
});

// Xóa format khi focus (bấm vào input) để dễ chỉnh sửa
amount.addEventListener('focus', (e) => {
  let value = e.target.value.replace(/,/g, '');
  if (value) {
    e.target.value = value;
  }
});

// 2. Hàm thêm giao dịch mới
function addTransaction(e) {
  e.preventDefault(); // Chặn việc load lại trang của form

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Vui lòng nhập đầy đủ nội dung và số tiền');
  } else {
    // Lấy loại giao dịch từ nút radio
    const type = document.querySelector('input[name="type"]:checked').value;
    
    // Xóa dấu phẩy trước khi lưu
    const cleanAmount = amount.value.replace(/,/g, '');
    
    // Chuyển đổi số tiền: nếu là chi tiêu thì nhân với -1
    const finalAmount = type === 'expense' ? -Math.abs(+cleanAmount) : Math.abs(+cleanAmount);
    
    // Nếu đang chỉnh sửa
    if (editingId !== null) {
      // Tìm và cập nhật giao dịch
      const index = transactions.findIndex(t => t.id === editingId);
      if (index !== -1) {
        transactions[index].text = text.value;
        transactions[index].amount = finalAmount;
      }
      editingId = null;
      document.querySelector('.btn').textContent = 'Thêm Giao Dịch';
    } else {
      // Thêm giao dịch mới
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: finalAmount,
        date: new Date().toISOString() // Thêm ngày giờ
      };
      transactions.push(transaction);
    }

    updateLocalStorage();
    saveToFirebase(); // Sync với Firebase
    init();

    // Xóa trắng ô nhập liệu sau khi thêm
    text.value = '';
    amount.value = '';
    
    // Reset về mặc định là "Thu Nhập"
    document.querySelector('input[name="type"][value="income"]').checked = true;
  }
}

// 3. Hàm tạo ID ngẫu nhiên
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 4. Hàm hiển thị giao dịch lên màn hình (DOM)
function addTransactionDOM(transaction) {
  // Xác định dấu + hay -
  const sign = transaction.amount < 0 ? '-' : '+';
  
  const item = document.createElement('li');

  // Thêm class 'plus' hoặc 'minus' dựa trên giá trị
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // Định dạng số tiền có dấu phẩy (ví dụ: 100,000)
  const formattedAmount = Math.abs(transaction.amount).toLocaleString('vi-VN');
  
  // Format ngày giờ theo timezone Việt Nam (UTC+7)
  const date = transaction.date ? new Date(transaction.date) : new Date();
  
  // Chuyển sang giờ Việt Nam
  const vnDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  
  const dateStr = `${vnDate.getDate().toString().padStart(2, '0')}/${(vnDate.getMonth() + 1).toString().padStart(2, '0')}/${vnDate.getFullYear()}`;
  const timeStr = `${vnDate.getHours().toString().padStart(2, '0')}:${vnDate.getMinutes().toString().padStart(2, '0')}`;

  item.innerHTML = `
    <div class="transaction-content">
      <div class="transaction-text">${transaction.text}</div>
      <div class="transaction-date">${dateStr} ${timeStr}</div>
    </div>
    <span class="transaction-amount">${sign}${formattedAmount} đ</span>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})">✏️</button>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// 5. Hàm cập nhật số dư, tổng thu, tổng chi
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  // Tính tổng số dư
  const total = amounts.reduce((acc, item) => (acc += item), 0);

  // Tính tổng thu (số dương)
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  // Tính tổng chi (số âm)
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  );

  // Cập nhật lên màn hình
  balance.innerText = `${total.toLocaleString('vi-VN')} đ`;
  money_plus.innerText = `+${income.toLocaleString('vi-VN')} đ`;
  money_minus.innerText = `-${expense.toLocaleString('vi-VN')} đ`;
}

// 6. Hàm xóa giao dịch
function removeTransaction(id) {
  if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    saveToFirebase(); // Sync với Firebase
    init();
  }
}

// 6.1. Hàm sửa giao dịch
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (transaction) {
    // Điền thông tin vào form
    text.value = transaction.text;
    amount.value = Math.abs(transaction.amount).toLocaleString('en-US');
    
    // Chọn đúng loại giao dịch
    const type = transaction.amount < 0 ? 'expense' : 'income';
    document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
    
    // Lưu ID đang chỉnh sửa
    editingId = id;
    
    // Đổi text nút
    document.querySelector('.btn').textContent = 'Cập Nhật';
    
    // Scroll lên form
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

// 7. Hàm lưu vào LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 8. Hàm khởi chạy ứng dụng
function init() {
  list.innerHTML = '';
  
  // Tạo dropdown tháng
  populateMonthSelect();
  
  // Lọc giao dịch theo tháng đang xem
  const filteredTransactions = transactions.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    // Chuyển sang timezone Việt Nam để so sánh tháng
    const vnDate = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    return vnDate.getMonth() === currentViewMonth && vnDate.getFullYear() === currentViewYear;
  });
  
  // Sắp xếp giao dịch mới nhất lên đầu
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Chỉ hiển thị 5 giao dịch gần nhất nếu chưa bấm "Xem tất cả"
  const displayTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 5);
  
  displayTransactions.forEach(addTransactionDOM);
  updateValues();
  updateMonthSummary(filteredTransactions);
  
  // Hiển thị/ẩn nút "Xem tất cả"
  const showMoreContainer = document.getElementById('show-more-container');
  const showMoreBtn = document.getElementById('show-more-btn');
  
  if (filteredTransactions.length > 5) {
    showMoreContainer.style.display = 'block';
    showMoreBtn.textContent = showAll ? 'Thu gọn' : `Xem tất cả (${filteredTransactions.length - 5} giao dịch)`;
  } else {
    showMoreContainer.style.display = 'none';
  }
}

// Tạo dropdown chọn tháng
function populateMonthSelect() {
  const select = document.getElementById('month-select');
  select.innerHTML = '';
  
  // Lấy tháng đầu tiên và cuối cùng có giao dịch
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  
  const months = [];
  let currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Tạo list 12 tháng gần nhất
  for (let i = 0; i < 12; i++) {
    months.unshift(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() - 1);
  }
  
  months.forEach(date => {
    const option = document.createElement('option');
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    option.value = `${date.getFullYear()}-${date.getMonth()}`;
    option.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (date.getMonth() === currentViewMonth && date.getFullYear() === currentViewYear) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

// Cập nhật tổng kết tháng
function updateMonthSummary(monthTransactions) {
  const summary = document.getElementById('month-summary');
  
  if (monthTransactions.length === 0) {
    summary.style.display = 'none';
    return;
  }
  
  summary.style.display = 'block';
  
  const income = monthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = Math.abs(monthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
    
  const balance = income - expense;
  
  document.getElementById('month-income').textContent = `+${income.toLocaleString('vi-VN')} đ`;
  document.getElementById('month-expense').textContent = `-${expense.toLocaleString('vi-VN')} đ`;
  
  const balanceEl = document.getElementById('month-balance');
  balanceEl.textContent = `${balance >= 0 ? '+' : ''}${balance.toLocaleString('vi-VN')} đ`;
  balanceEl.className = `money ${balance >= 0 ? 'plus' : 'minus'}`;
}

// Xử lý chọn tháng
document.getElementById('month-select').addEventListener('change', (e) => {
  const [year, month] = e.target.value.split('-');
  currentViewYear = parseInt(year);
  currentViewMonth = parseInt(month);
  showAll = false;
  init();
});

// Xử lý nút prev/next month
document.getElementById('prev-month').addEventListener('click', () => {
  currentViewMonth--;
  if (currentViewMonth < 0) {
    currentViewMonth = 11;
    currentViewYear--;
  }
  showAll = false;
  init();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentViewMonth++;
  if (currentViewMonth > 11) {
    currentViewMonth = 0;
    currentViewYear++;
  }
  showAll = false;
  init();
});

// Xử lý nút "Xem tất cả"
document.getElementById('show-more-btn').addEventListener('click', () => {
  showAll = !showAll;
  init();
});

init();
displayQuickNotes();

// Lắng nghe sự kiện bấm nút Thêm
form.addEventListener('submit', addTransaction);

// ===== QUICK NOTES FUNCTIONS =====
// Hiển thị modal thêm ghi chú nhanh
function showAddQuickNote() {
  editingNoteId = null;
  document.getElementById('modal-title').textContent = 'Thêm ghi chú nhanh';
  document.getElementById('note-text').value = '';
  document.getElementById('note-amount').value = '';
  document.querySelector('input[name="note-type"][value="income"]').checked = true;
  document.getElementById('quick-note-modal').style.display = 'flex';
}

// Đóng modal
function closeQuickNoteModal() {
  document.getElementById('quick-note-modal').style.display = 'none';
  editingNoteId = null;
}

// Hiển thị modal sửa ghi chú nhanh
function editQuickNote(id) {
  const note = quickNotes.find(n => n.id === id);
  if (note) {
    editingNoteId = id;
    document.getElementById('modal-title').textContent = 'Sửa ghi chú nhanh';
    document.getElementById('note-text').value = note.text;
    document.getElementById('note-amount').value = Math.abs(note.amount).toLocaleString('vi-VN');
    
    const type = note.amount < 0 ? 'expense' : 'income';
    document.querySelector(`input[name="note-type"][value="${type}"]`).checked = true;
    
    document.getElementById('quick-note-modal').style.display = 'flex';
  }
}

// Format số tiền cho ghi chú
const noteAmountInput = document.getElementById('note-amount');
noteAmountInput.addEventListener('blur', (e) => {
  let value = e.target.value.replace(/,/g, '').trim();
  if (value && !isNaN(value) && value !== '') {
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = formatted;
  }
});

noteAmountInput.addEventListener('focus', (e) => {
  let value = e.target.value.replace(/,/g, '');
  if (value) {
    e.target.value = value;
  }
});

// Xử lý form ghi chú nhanh
document.getElementById('quick-note-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const noteText = document.getElementById('note-text').value.trim();
  const noteAmount = document.getElementById('note-amount').value.replace(/,/g, '').trim();
  const noteType = document.querySelector('input[name="note-type"]:checked').value;
  
  if (!noteText || !noteAmount) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }
  
  const finalAmount = noteType === 'expense' ? -Math.abs(+noteAmount) : Math.abs(+noteAmount);
  
  if (editingNoteId !== null) {
    // Sửa ghi chú
    const index = quickNotes.findIndex(n => n.id === editingNoteId);
    if (index !== -1) {
      quickNotes[index].text = noteText;
      quickNotes[index].amount = finalAmount;
    }
  } else {
    // Thêm ghi chú mới
    const newNote = {
      id: generateID(),
      text: noteText,
      amount: finalAmount
    };
    quickNotes.push(newNote);
  }
  
  updateQuickNotesStorage();
  displayQuickNotes();
  closeQuickNoteModal();
});

// Hiển thị danh sách ghi chú nhanh
function displayQuickNotes() {
  const container = document.getElementById('quick-notes-list');
  container.innerHTML = '';
  
  if (quickNotes.length === 0) {
    container.innerHTML = '<p class="no-notes">Chưa có ghi chú nhanh nào. Thêm ghi chú để thêm giao dịch nhanh hơn!</p>';
    return;
  }
  
  quickNotes.forEach(note => {
    const noteEl = document.createElement('div');
    noteEl.classList.add('quick-note-item');
    noteEl.classList.add(note.amount < 0 ? 'expense' : 'income');
    
    const sign = note.amount < 0 ? '-' : '+';
    const formattedAmount = Math.abs(note.amount).toLocaleString('vi-VN');
    
    noteEl.innerHTML = `
      <div class="quick-note-content">
        <span class="quick-note-text">${note.text}</span>
        <span class="quick-note-amount">${sign}${formattedAmount} đ</span>
      </div>
      <div class="quick-note-actions">
        <button onclick="useQuickNote(${note.id})" class="btn-use" title="Sử dụng">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5l-6 6-3-3"/>
          </svg>
        </button>
        <button onclick="editQuickNote(${note.id})" class="btn-edit" title="Sửa">✏️</button>
        <button onclick="deleteQuickNote(${note.id})" class="btn-delete" title="Xóa">🗑️</button>
      </div>
    `;
    
    container.appendChild(noteEl);
  });
}

// Sử dụng ghi chú nhanh (thêm vào giao dịch)
function useQuickNote(id) {
  const note = quickNotes.find(n => n.id === id);
  if (note) {
    const transaction = {
      id: generateID(),
      text: note.text,
      amount: note.amount,
      date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    updateLocalStorage();
    saveToFirebase();
    init();
    
    // Hiển thị thông báo
    showNotification(`Đã thêm: ${note.text}`);
  }
}

// Xóa ghi chú nhanh
function deleteQuickNote(id) {
  if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
    quickNotes = quickNotes.filter(n => n.id !== id);
    updateQuickNotesStorage();
    displayQuickNotes();
  }
}

// Cập nhật localStorage cho ghi chú nhanh
function updateQuickNotesStorage() {
  localStorage.setItem('quickNotes', JSON.stringify(quickNotes));
  saveToFirebase();
}

// Hiển thị thông báo tạm thời
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}
