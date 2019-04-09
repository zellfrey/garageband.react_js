class Api::V1::LikesController < ApplicationController

    def index
        @likes = Like.all
        render json: @likes
    end

    def show
        @like = Like.find(params[:id])
        render json: @like
    end

    def create 
        like = Like.create(like_params)
        render json: like
    end

    def destroy
        @like = Like.find(params[:id])
        @like.destroy
        # @likes = like.all
        render json: @like
    end

    private
    def like_params
    params.permit(:admirer_id, :project_id)
    end

end
