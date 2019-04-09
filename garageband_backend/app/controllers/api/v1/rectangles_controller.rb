require 'byebug'
class Api::V1::RectanglesController < ApplicationController

    def index 
        @rectangles = Rectangle.all
        render json: @rectangles
    end

    def show
        @rectangle = Rectangle.find(params[:id])
        render json: @rectangle
    end

    def create 
        rectangle = Rectangle.create(rectangle_params)
        render json: rectangle
    end

    def update
        @rectangle = Rectangle.find(params[:id])
        @rectangle.update(rectangle_params)
        render json: @rectangle, status: 200
    end

    def destroy
        @rectangle = Rectangle.find(params[:id])
        @rectangle.destroy
        @rectangles = Rectangle.all
        render json: @rectangles
    end

    private
    def rectangle_params
    params.require(:rectangle).permit(:project_id, :note_id, :posX, :posY, :width, :height)
    end
end
