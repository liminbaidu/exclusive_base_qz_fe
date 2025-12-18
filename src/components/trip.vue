<template>
    <div class="trip">
        <div class="diary-data1" style="color: black;" >
            <v-infinite-scroll
                height="90vh"
                width="100vw"
                side="end"
                @load="load"
            >   
                <v-row width="100vw" style="margin:0%">
                    <v-col
                        v-for="card in cards"
                        :key="card.title"
                        :cols="card.flex"
                        style="padding: 8px;"
                    >
                        <v-card>
                            <v-img
                                :src="card.src"
                                class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                height="30vh"
                                width="auto"
                                cover
                                style="cursor: pointer"
                                @click="imgClick(card.src)" 
                                >
                                <v-card-title class="text-white" v-text="card.title"></v-card-title>
                            </v-img>
                        </v-card>
                    </v-col>
                </v-row>
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
            </v-infinite-scroll>
        </div>
    </div>
</template>

<script>
    import { te } from 'element-plus/es/locales.mjs';
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
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_1_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_2_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103827_5_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103828_6_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103829_7_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103830_8_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103831_10_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103831_9_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103832_11_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103833_12_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_20251218103833_13_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_3_2.jpg', flex: 6 },
                    {title: '2022/01/02', src: '../../public/img/trip/破烂小娃/微信图片_4_2.jpg', flex: 6 }
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
                done('empty');
                return;
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
</style>