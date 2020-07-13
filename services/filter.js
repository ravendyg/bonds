const constants = require('../constants');
const filterFileName = 'filters.json';

module.exports = function createFilterService(fs, config) {
  let storage = {};
  let saveTask = null;
  let dirty = false;

  const { dataDir } = config;
  const filePath = `${dataDir}/${filterFileName}`;
  if (fs.existsSync(filePath)) {
    storage = JSON.parse(fs.readFileSync(filePath, { encoding: constants.UTF8}));
  }

  async function save() {
    try {
      dirty = false;
      saveTask = fs.promises.writeFile(filePath, JSON.stringify(storage), { encoding: constants.UTF8});
      await saveTask;
    } catch (e) {
      console.error(e);
    }
    saveTask = null;
    if (dirty) {
      save();
    }
  }

  function postEdit() {
    dirty = true;
    if (saveTask === null) {
      save();
    }
  }

  return {
    get() {
      return {
        ...storage,
      };
    },
    add(bondName) {
      storage[bondName] = 1;
      postEdit();
    },
    remove(bondName) {
      delete storage[bondName];
      postEdit();
    },
  };
};
