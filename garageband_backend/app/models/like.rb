class Like < ApplicationRecord
    belongs_to :admirer, class_name: 'User'
    belongs_to :project
end
