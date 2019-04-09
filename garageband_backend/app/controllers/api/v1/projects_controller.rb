require 'byebug'
class Api::V1::ProjectsController < ApplicationController
    
    def index
        @projects = Project.all
        render json: @projects
    end

    def show
        @project = Project.find(params[:id])
        render json: @project
    end

    def create 
        project = Project.create(project_params)
        render json: project
    end

    def update
        @project = Project.find(params[:id])
        @project.update(project_params)
        render json: @project, status: 200
    end

    def destroy
        @project = Project.find(params[:id])
        @project.destroy
        # @projects = Project.all
        render json: @project
    end

    private
    def project_params
    params.require(:project).permit(:author_id, :name, :image, :description, :width, :height, :amount_of_notes, :tempo, :rectangles)
    end

end
