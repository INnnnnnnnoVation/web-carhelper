function calculate() {
  const carPrice = parseFloat(document.getElementById('car-price').value);
  const term = parseInt(document.getElementById('term').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100; // 转换为小数
  const insurance = parseFloat(document.getElementById('insurance').value || 0); // 默认为0
  const downPayment = parseFloat(document.getElementById('down-payment').value || 0); // 默认为0
  const tax = parseFloat(document.getElementById('tax').value || 0); // 默认为0
  const repaymentMethod = document.querySelector('input[name="repayment-method"]:checked').value;
  const resultDetails = document.getElementById('result-details');

  if (!carPrice || !rate || !term) {
    alert('车价、费率和期限是必填项！');
    return;
  }

  const totalMonths = term * 12;
  const monthlyRate = rate / 12;
  const loanAmount = carPrice - downPayment; // 贷款金额

  let monthlyPayment = 0;
  let totalInterest = 0;
  let remainingBalance = loanAmount;
  const monthlyInterest = [];
  const monthlyPrincipal = [];

  if (repaymentMethod === '等额本息') {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    for (let month = 1; month <= totalMonths; month++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingBalance -= principal;
      totalInterest += interest;
      monthlyInterest.push(interest);
      monthlyPrincipal.push(principal);
    }
  } else if (repaymentMethod === '等额本金') {
    const principalPerMonth = loanAmount / totalMonths;
    for (let month = 1; month <= totalMonths; month++) {
      const interest = remainingBalance * monthlyRate;
      remainingBalance -= principalPerMonth;
      totalInterest += interest;
      monthlyInterest.push(interest);
      monthlyPrincipal.push(principalPerMonth);
    }
  }

  const totalCost = carPrice + totalInterest + tax + insurance;

  let resultHTML = `
    <p>还款方式：${repaymentMethod}</p>
    <p>总利息：¥${totalInterest.toFixed(2)}</p>
    <p>总花费：¥${totalCost.toFixed(2)}</p>
    <h3>费用明细：</h3>
    <p>裸车价：¥${carPrice.toFixed(2)}</p>
    <p>首付：¥${downPayment.toFixed(2)}</p>
    <p>贷款金额：¥${loanAmount.toFixed(2)}</p>
    <p>税额：¥${tax.toFixed(2)}</p>
    <p>保险费用：¥${insurance.toFixed(2)}</p>
    <h3>月供明细：</h3>
  `;

  for (let month = 0; month < totalMonths; month++) {
    const monthNumber = month + 1;
    const interest = monthlyInterest[month];
    const principal = monthlyPrincipal[month];
    const payment = repaymentMethod === '等额本息' ? monthlyPayment : principal + interest;
    resultHTML += `
      <p>第${monthNumber}个月：本金 ¥${principal.toFixed(2)}，利息 ¥${interest.toFixed(2)}，月供 ¥${payment.toFixed(2)}</p>
    `;
  }

  resultDetails.innerHTML = resultHTML;

  // 显示模态框
  const modal = document.getElementById('result-modal');
  modal.style.display = 'block';
  modal.style.animation = 'modalFadeIn 0.5s forwards';

  // 点击模态框以外区域关闭模态框
  window.onclick = function(event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

function closeModal() {
  const modal = document.getElementById('result-modal');
  modal.style.animation = 'modalFadeOut 0.5s forwards';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
}

// 添加动画的CSS
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});