class RoutesComponent {
    rootComponent() {
        return import('../views/Root.vue')
      }


      homeComponent() {
        return import('../views/Home.vue')
      }

      rankingComponent() {
        return import('../views/Ranking.vue')
      }

      MVComponent() {
        return import('../views/MV.vue')
      }

      singerComponent() {
        return import('../views/Singer.vue')
      }

      songSheetComponent() {
        return import('../views/SongSheet.vue')
      }

      sheetDetailComponent() {
        return import('../views/SheetDetail.vue')
      }

      mvDetailComponent() {
        return import('../views/MVDetail.vue')
      }

      singerDetailComponent(){
        return import('../views/SingerDetail.vue')
      }

      wordComponent(){
        return import('../views/Word.vue')
      }

      searchComponent(){
        return import('../views/Search.vue')
      }

}

export default new RoutesComponent()