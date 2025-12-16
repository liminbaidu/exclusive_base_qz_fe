<template>
    <div class="trip">
        <div class="diary-data1" style="color: black;" >
            <v-infinite-scroll
                height="100vh"
                width="100vw"
            >
                <v-card dense
                    class="mx-auto"
                    max-width="500"
                >
                    <v-row>
                        <v-col
                            v-for="card in cards"
                            :key="card.title"
                            :cols="card.flex"
                        >
                            <v-card>
                                <v-img
                                    :src="card.src"
                                    class="align-end"
                                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                    height="200px"
                                    cover
                                    style="cursor: pointer"
                                    @click="imgClick(card.src)" 
                                    
                                    >
                                    <v-card-title class="text-white" v-text="card.title"></v-card-title>
                                </v-img>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-infinite-scroll>
            <v-dialog
                v-model="dialogOpen"
                fullscreen 
                transition="dialog-fade-transition" 
                @click:outside="dialogOpen = false" 
                >
                <v-card elevation="0" class="pa-0 ma-0">
                    <v-img
                        :src="imgSrc"
                        alt="放大图片"
                        contain
                        class="cursor-pointer"
                        @click="dialogOpen = false" 
                    ></v-img>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    export default {
        data(){
            return{
                diarylist:[],
                isloading:false,
                page:1,
                size:10,
                hasMore:true,
                tipVisible:false,
                dialogOpen:false,
                imgSrc:"",
                tip:'',
                cards : [
                    { title: '2022/01/02', src: '../../public/img/头像.jpg', flex: 12 },
                    { title: 'Pre-fab homes', src: '../../public/img/trip/去月球.png', flex: 6 },
                    { title: 'Pre-fab homes', src: '../../public/img/trip/去月球.png', flex: 6 },
                ],
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        },
        async mounted(){
            await this.Getdiarylist();
        },
        methods:{
            load ({ done }) {
                console.log("load"+this.hasMore)
                if (this.hasMore==false){
                    done('empty');
                    return;
                }
                setTimeout(() => {
                    if (this.page==1 && this.diarylist.length!=0){
                        done('empty');
                        return;
                    }
                    this.Getdiarylist()
                    done('ok');
                }, 1000)
            },
            imgClick (src) {
                this.dialogOpen = true
                this.imgSrc=src
            }
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/diary/diary.css);
</style>