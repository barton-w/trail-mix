if ($()) {
  console.log("jQuery on");
}

$(() => {
  let $p1 = $("#p1");
  let $p2 = $("#p2");
  let $messageStatus = $("#message-status");
  let $createAccount = $("#create-account");
  $createAccount.prop("disabled", true);

  //validation function
  const validate = () => {
    if ($p1.val() === $p2.val()) {
      $messageStatus.text("Passwords Match ✓").attr("class", "message-good");
      $createAccount.prop("disabled", false);
    } else {
      $messageStatus.text("Match Those Passwords...").attr("class", "message-bad");
      $createAccount.prop("disabled", true);
    };
  };
  $p2.keyup(validate);
});
