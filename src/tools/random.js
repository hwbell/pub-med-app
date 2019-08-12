let list = [];
for (let i = 0; i < 50; i++) {
  list.push({
    title: `Article ${i + 1}`,
    pmid: `PMID10000${i}`
  })
}

console.log(list)