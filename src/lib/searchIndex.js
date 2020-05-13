const elasticLunr = require('elasticlunr')
const { json } = require('micro')
const { createError } = require('micro')
const fs = require('fs')

module.exports = async (req, indexFilePath) => {
  const body = await json(req)
  const { config } = body

  const index = elasticLunr(function () {
    config.searchFields.forEach(field => this.addField(field))
    this.setRef('id')
    this.saveDocument(config.saveDocument)
  })
  // FIXME: não falhar se um documento ou outro estiver fora do padrão - logar
  body.documents.forEach((item) => {
    index.addDoc(item)
  })
  fs.writeFileSync(indexFilePath, JSON.stringify(index))
}
