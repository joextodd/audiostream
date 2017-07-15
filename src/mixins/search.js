export const Search = () => ({
  state: {
    url: 'https://www.googleapis.com/youtube/v3',
    key: 'AIzaSyBudPwcEKAS7KEyMnyDOPuHUv5pd3vSZ-U',
    results: 5,
    searchString: '',
    searchToken: '',
    search: [],
    next: [],
  },
  events: {
    loaded: (s,a) => a.search('')
  },
  actions: {
    setSearchString: (s,a,d) => ({ searchString: d }),
    setSearchToken: (s,a,d) => ({ searchToken: d.nextPageToken }),
    setSearchNext: (s,a,d) => ({ search: s.search.concat(d.items) }),
    setSearch: (s,a,d) => ({ search: d.items }),
    setNext: (s,a,d) => ({ next: d.items }),
    nextVideo: (s,a,d) => {
      a.pause()
      if (!s.partyId || (s.partyId && s.partyQ.length <= 1)) {
        const idx = parseInt(Math.random() * (s.results - 1))
        fetch(`${s.url}/search` +
              '?part=snippet' +
              `&maxResults=${s.results}` +
              `&relatedToVideoId=${s.id}` +
              '&videoCategoryId=10' +
              '&type=video' +
              `&key=${s.key}`)
        .then(r => r.json())
        .then(d => {
          a.setNext(d)
          s.partyId ?
            a.savePartyState(d.items[idx].id.videoId) :
              a.router.go(`/${d.items[idx].id.videoId}`)
        })
        .catch(console.log)
      }
      s.partyId && a.nextQTrack()
    },
    search: (s,a,d) => {
      a.setSearchString(d.target ? d.target.value : d)
      fetch(`${s.url}/search` +
            '?part=snippet' +
            `&maxResults=${s.results}` +
            `&q=${d.target ? d.target.value : d}` +
            '&type=video' +
            '&videoCategoryId=10' +
            `&key=${s.key}`)
      .then(r => r.json())
      .then(d => {
        a.setSearch(d)
        a.setSearchToken(d)
      })
      .catch(console.log)
    },
    searchNext: (s,a,d) => {
      fetch(`${s.url}/search` +
            '?part=snippet' +
            `&maxResults=${s.results}` +
            `&q=${s.searchString}` +
            '&type=video' +
            `&pageToken=${s.searchToken}` +
            '&videoCategoryId=10' +
            `&key=${s.key}`)
      .then(r => r.json())
      .then(d => {
        a.setSearchNext(d)
        a.setSearchToken(d)
      })
      .catch(console.log)
    },
  },
})
