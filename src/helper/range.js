// range: bytes= [start]-[end] request-header
// Accept-Ranges: bytes response-header
// Content-Range: bytes start-end/total response-header

module.exports = (totalSize, req, res) => {
  const range = req.headers['range']
  if (!range) {
    return {code: 200}
  }

  const size = range.match(/bytes=([-,+]?\d*)-([-,+]?\d*)/)
  const start = parseInt(size[1] || 0)
  const end = parseInt(size[2] || totalSize - 1)
  if (start < 0 || end > totalSize || start > end) {
    return {code: 200}
  }

  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Range', `bytes ${start}-${end}/${end - start}`)
  res.setHeader('Content-Length', end - start)
  return {
    code: 206,
    start,
    end
  }
}