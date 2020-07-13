function findParentTr(node) {
  if (!node) {
    return null;
  }
  if (node.tagName === 'A') {
    return null;
  }
  if (node.tagName === 'TR') {
    return node;
  }
  const parent = node.parentElement;
  if (!parent) {
    return null;
  }
  return findParentTr(parent);
}

function getBondName(tr) {
  return tr.children[1].textContent;
}

function splitCookie(str) {
  if (!str) {
    return {};
  }
  const items = str.split(';')
    .map(item => item.trim())
    .map(item => item.split('='))
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {})
    ;

  return items;
}

document.addEventListener('click', event => {
  const tg = event.target;
  if (tg.className !== 'hide') {
    return;
  }
  const tr = findParentTr(tg);
  if (!tr) {
    return;
  }
  const name = encodeURI(getBondName(tr));
  const ck = splitCookie(document.cookie);
  const hidden = ck.hidden
    ? `${ck.hidden}|${name}`
    : name;
  document.cookie = `hidden=${hidden}`;
  location.reload();
});
