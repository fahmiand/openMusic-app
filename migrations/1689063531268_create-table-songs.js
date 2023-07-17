exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(128)',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(20)',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(25)',
      notNull: true
    },
    duration: {
      type: 'INTEGER'
    },
    album_id: {
      type: 'VARCHAR(50)'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('songs')
}
