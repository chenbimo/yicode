<template>
    <div class="home-more">
        <div class="git-repo">
            <a class="gitee" href="https://gitee.com/yicode-team/yicode" target="_blank">
                <img src="https://gitee.com/yicode-team/yicode/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b" />
            </a>
        </div>
    </div>
</template>
<script setup></script>
<style lang="scss">
.home-more {
    overflow-x: hidden;
    $mainColor: #a20300;
    .wrapper {
        margin: 0 auto;
        max-width: 1152px;
    }
    .git-repo {
        display: flex;
        justify-content: center;
        padding: 0 15px;
        margin-top: 100px;
        .gitee {
            display: flex;
            justify-content: center;
        }
    }

    .doc {
        font-size: 12px;
        background-color: #999;
        color: #fff;
        padding: 0 10px;
        border-radius: 4px;
        word-break: keep-all;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
    }

    .btn {
        font-size: 12px;
        background-color: #989898;
        color: #fff;
        padding: 0 10px;
        border-radius: 4px;
        word-break: keep-all;
        white-space: nowrap;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
        transition: all 0.2s;
        &.preview {
            background: #f3c230;
        }
        &.visit {
            background: #4565d8;
        }
        &:hover {
            box-shadow: 0px 4px 2px #666;
        }
    }

    .panel {
        margin-top: 10px;
        .wrapper {
        }
        .common-title {
            display: flex;
            justify-content: center;
            margin: 150px 0 50px;
            padding: 0 15px;
            .inner {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100px;
                background-color: #fff;
                width: 100%;
                box-shadow: 0 0 1px rgba(0, 0, 0, 0);
                position: relative;
                border-radius: 4px;
                border-top: 4px solid #2c3e50;
            }
            .line-box {
                position: relative;
                height: 10px;
                display: flex;
                justify-content: center;
                margin-top: 12px;
                width: 300px;
                .line {
                    position: absolute;
                    top: 5px;
                    left: 0;
                    width: 100%;
                    border-bottom: 1px solid #2c3e50;
                }
                .box {
                    height: 10px;
                    width: 30px;
                    background-color: #2c3e50;
                }
            }
            .name {
                text-align: center;
                font-size: 24px;
                height: 44px;
                border-radius: 22px;
                line-height: 36px;
                font-weight: bold;
                color: $mainColor;
                border: 4px solid #2c3e50;
                margin-top: -44px;
                padding: 0px 20px;
                background-color: #fff;
            }
            .describe {
                text-align: center;
                color: #999;
                font-size: 16px;
                margin-top: 6px;
            }
        }

        .common-sub-title {
            text-align: center;
            padding: 15px 15px 5px;
            font-size: 18px;
            font-weight: bold;
        }

        .common-sub-describe {
            font-size: 14px;
            color: #999;
            text-align: center;
            margin-bottom: 20px;
            padding: 0 15px;
        }
        &.document {
            .group-box {
                .box {
                    flex: 0 0 25%;
                }
            }
        }
        .group-box {
            display: flex;
            flex-wrap: wrap;
            padding: 0 5px;
            .describe {
                font-size: 16px;
                color: #999;
                text-align: center;
                margin-bottom: 30px;
            }
            .box {
                flex: 0 0 33.333333%;
                padding: 10px 10px;
                .box-inner {
                    background-color: #f7f7f7;
                    border: 4px solid transparent;
                    transition: all 0.2s;
                    padding: 30px 10px;
                    border-radius: 6px;
                    &:hover {
                        border: 4px solid #eee;
                    }
                }

                .thumbnail {
                    font-size: 22px;
                    font-weight: bold;
                    text-align: center;
                    color: #a20300;
                }
                .describe {
                    margin: 6px 0;
                    color: #999;
                    font-size: 14px;
                    height: 40px;
                    line-height: 20px;
                    overflow: hidden;
                }
                .status {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .img,
                    .link {
                        margin-right: 6px;
                    }
                }
            }
        }
        .group-line {
            .describe {
                font-size: 16px;
                color: #999;
                text-align: left;
            }
            .w-10px {
                width: 10px;
                min-width: 10px;
            }
            .line {
                padding: 0 15px;
                .line-inner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 4px;
                    &:hover {
                        background-color: #f7f7f7;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                }

                .thumbnail {
                    flex: 0 0 auto;
                    min-width: 200px;
                    font-size: 22px;
                    font-weight: bold;
                    color: #a20300;
                }
                .describe {
                    flex: 1 1 100%;
                    font-size: 14px;
                }
                .status {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
        }
    }

    @media screen and (max-width: 800px) {
        .panel {
            &.document {
                .group-box {
                    .box {
                        flex: 0 0 100%;
                        width: 100%;
                    }
                }
            }
            .group-box {
                .box {
                    flex: 0 0 100%;
                    width: 100%;
                }
            }
            .group-line {
                .line {
                    margin-bottom: 10px;
                    .line-inner {
                        display: block;
                        .thumbnail {
                            width: 100%;
                            text-align: center;
                        }
                        .describe {
                            width: 100%;
                            text-align: center;
                            margin-bottom: 6px;
                        }
                        .status {
                            justify-content: center;
                        }
                    }
                }
            }
        }
    }
}
</style>
