Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :notes, only: [:index]
      resources :projects
      resources :rectangles
      resources :users, only: [:index, :show] 
      resources :likes, only: [:index, :show, :create, :destroy]
    end
  end
end