const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const verifyBtn = document.getElementById("verifyBtn");
const timer = document.getElementById("timer");

let countdown = 60;
let interval = null;

// SHOW OTP + COUNTDOWN
sendOtpBtn.onclick = () => {
  otpSection.classList.remove("hidden");
  startTimer();

  sendOtpBtn.innerText = "OTP Sent";
  sendOtpBtn.disabled = true;
};

function startTimer() {
  countdown = 60;
  timer.innerText = "Resend OTP in 60s";

  interval = setInterval(() => {
    countdown--;
    timer.innerText = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(interval);
      timer.innerText = "";
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerText = "Send OTP Again";
    }
  }, 1000);

  // SHOW VERIFY BUTTON
  verifyBtn.classList.remove("hidden");
}

// SUBMIT TO BACKEND
verifyBtn.onclick = async () => {
  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  const otpInputs = document.querySelectorAll(".otp");
  let otp = "";
  otpInputs.forEach(i => otp += i.value);

  if (!identifier || !password || otp.length !== 5) {
    alert("Please fill all fields!");
    return;
  }

  const response = await fetch("/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, otp })
  });

  const data = await response.json();
  alert(data.message);
};
