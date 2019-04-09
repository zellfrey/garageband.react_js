class User < ApplicationRecord
    has_many :projects
    
    has_many :likes
    has_many :projects, through: :likes
end
