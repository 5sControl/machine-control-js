function intersection(bbox_1, bbox_2) {
    const rect_1 = convertBboxToRect(bbox_1)
    const rect_2 = convertBboxToRect(bbox_2)
    return rectanglesIntersect(rect_1, rect_2)
}
function convertBboxToRect(bbox) {
    const [x, y, width, height] = bbox
    return [x, y, x + width, y + height]
}
function rectanglesIntersect(rectA, rectB) {
    const [minAx, minAy, maxAx, maxAy] = rectA
    const [minBx,  minBy,  maxBx,  maxBy] = rectB
    return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}

module.exports = {intersection}