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
    
    // Realtime sync
    database.ref('users/' + currentUser.uid + '/transactions').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        transactions = data;
        init();
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

// Biến để lưu ID đang chỉnh sửa
let editingId = null;

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
        amount: finalAmount
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

  item.innerHTML = `
    ${transaction.text} <span>${sign}${formattedAmount} đ</span>
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
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Lắng nghe sự kiện bấm nút Thêm
form.addEventListener('submit', addTransaction);
