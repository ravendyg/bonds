const columnNames = [
    'Время',
    'Имя',
    'Погашение',
    'Лет до погаш.',
    'Доходн',
    'Дох.без.реинв.',
    'Год.куп.дох.',
    'Куп.дох.посл.',
    'Цена',
    'Объём',
    'Купон',
    'Частота',
    'НКД',
    'Дюрация',
    'Дата куп.',
];

const createColumnHeaders =
    (type, selected, order) => {
        const insertBcs = type === 'bonds' || type === 'subfed';
        const names = columnNames
            .map((name, index) => '<th><a href="/?'
                + `type=${type}&`
                + `sort=${index}&`
                + `order=${index !== selected
                    ? order
                    : order === 'desc'
                        ? 'asc'
                        : 'desc'
                }`
                + `">${name}</a></th>`);
        if (insertBcs) {
            names.push(`<th>БКС</th>`);
        }
        return names.join('');
    };

module.exports = function toHtml(bonds, type, selected, order) {
    const insertBcs = type === 'bonds' || type === 'subfed';
    const bondsStrs = bonds.map(bond => {
        return '<tr>' +
            bond.map(item => {
                if (typeof item === 'object') {
                    const { name, href } = item;
                    return `<td><a href="${href}" target="_blank">${name}</a></td>`;
                } else {
                    return `<td>${item}</td>`;
                }
            }).join('')
            + '</tr>';
    }).join('');

    return `
    <html>
        <head>
        <link rel="stylesheet" type="text/css" href="/styles.css">
            <title>
                Bonds
            </title>
            <style>
                .list-item {
                    padding: 10px;
                    display: inline-block;
                }
                .active {
                    background-color: lightgray;
                    cursor: inherit;
                }
            </style>
        </head>
        <body>
            <div>
                <a class="list-item ${type === 'ofz' ? 'active' : ''}" href="/?type=ofz">ОФЗ</a>
                <a class="list-item ${type === 'subfed' ? 'active' : ''}" href="/?type=subfed">Субъекты</a>
                <a class="list-item ${type === 'bonds' ? 'active' : ''}" href="/?type=bonds">Корп</a>
            </div>
            <table class="simple-little-table trades-table">
                <thead>
                    <tr>
                        ${createColumnHeaders(type, selected, order)}
                    </tr>
                </thead>
                <tbody>
                    ${bondsStrs}
                </tbody>
            </table>
        </body>
    </html>`;
}
